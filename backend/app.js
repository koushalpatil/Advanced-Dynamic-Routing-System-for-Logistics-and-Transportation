const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// API Keys
const tomtomApiKey = '22x5vSFShYAmiQcYkwW2RIAzxrHbY4OV'; // Replace with your TomTom API Key
const aqiToken = 'd9199e5a670b1e601bd6b82406850d45b317a99e'; // Replace with your AQICN API Key
const openWeatherKey = 'a8e7ed043e9e27dae5809dd9e840fa08'; // Replace with your OpenWeatherMap API Key

// TomTom Traffic Data
const getTrafficData = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json`,
      { params: { key: tomtomApiKey, point: `${latitude},${longitude}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching traffic data:', error.message);
    return null;
  }
};

// AQICN Air Quality Data
const getAirQualityData = async (latitude, longitude) => {
  try {
    const response = await axios.get(`https://api.waqi.info/feed/geo:${latitude};${longitude}/`, {
      params: { token: aqiToken },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching air quality data:', error.message);
    return null;
  }
};

// OSRM Route Generation
const getRouteData = async (startLat, startLon, endLat, endLon) => {
  try {
    const response = await axios.get(
      `http://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}`,
      {
        params: {
          overview: 'full',
          geometries: 'geojson',
          alternatives: true, // Enable multiple routes
        },
      }
    );
    return response.data.routes; // Return all routes
  } catch (error) {
    console.error('Error fetching route data:', error.message);
    return null;
  }
};

// Helper function to get latitude and longitude of a city
const getCoordinatesForCity = async (city) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: { q: city, appid: openWeatherKey },
    });
    const { lat, lon } = response.data.coord;
    return { lat, lon };
  } catch (error) {
    console.error('Error fetching coordinates for city:', error.message);
    return null;
  }
};

// Carbon Emission Factors
const emissionFactors = {
  gasoline: 0.23, // kg CO2 per liter of gasoline
  diesel: 0.26,   // kg CO2 per liter of diesel
  electric: 0.1,  // kg CO2 per kWh of electricity (dependent on electricity grid mix)
};

// Carbon Emission Calculation
function calculateCarbonEmissions(distance, loadWeight, fuelType, fuelEfficiency) {
  const fuelConsumed = distance / fuelEfficiency; // distance divided by fuel efficiency
  const emissionFactor = emissionFactors[fuelType.toLowerCase()] || 0.21;
  const emissions = fuelConsumed * emissionFactor;
  const weightAdjustmentFactor = 1 + (loadWeight * 0.01); // Adjust for load weight
  return emissions * weightAdjustmentFactor;
}

// Utility function to sample key points from route coordinates
const sampleRouteCoordinates = (coordinates, numberOfPoints) => {
  const sampled = [];
  const totalPoints = coordinates.length;

  if (totalPoints <= numberOfPoints) {
    return coordinates;
  }

  const interval = totalPoints / (numberOfPoints + 1);
  for (let i = 1; i <= numberOfPoints; i++) {
    const index = Math.floor(i * interval);
    sampled.push(coordinates[index]);
  }

  return sampled;
};

// Fetch traffic, air quality, and carbon data for sampled coordinates
const getRouteDataDetails = async (coordinates, routeDistance, loadWeight, fuelType, fuelEfficiency) => {
  const details = [];
  let totalCarbon = 0;
  const numberOfSamplePoints = 5;

  const sampledCoordinates = sampleRouteCoordinates(coordinates, numberOfSamplePoints);

  for (const [lon, lat] of sampledCoordinates) {
    const traffic = await getTrafficData(lat, lon);
    const airQuality = await getAirQualityData(lat, lon);

    details.push({
      latitude: lat,
      longitude: lon,
      traffic,
      airQuality,
    });
  }

  totalCarbon = calculateCarbonEmissions(routeDistance, loadWeight, fuelType, fuelEfficiency);

  return { details, totalCarbon };
};

// Scoring System for Routes
const calculateRouteScore = (routeDetails, totalCarbon, routeDistance, routeDuration) => {
  let score = 0;

  routeDetails.forEach((point) => {
    if (point.airQuality && point.airQuality.data) {
      const aqi = point.airQuality.data.aqi;
      score += 100 - aqi;
    }
    if (point.traffic && point.traffic.flowSegmentData) {
      const currentSpeed = point.traffic.flowSegmentData.currentSpeed;
      const freeFlowSpeed = point.traffic.flowSegmentData.freeFlowSpeed;
      const speedRatio = currentSpeed / freeFlowSpeed;
      score += speedRatio * 100;
    }
  });

  score -= totalCarbon * 10;
  score -= routeDistance * 0.1;
  score -= routeDuration / 60;

  return score;
};

// Find the best route among multiple options
const findBestRoute = async (routes, loadWeight, fuelType, fuelEfficiency) => {
  let fastestRoute = null;
  let ecoFriendlyRoute = null;
  let leastTrafficRoute = null;
  let bestRoute = null;
  let longestRoute = null;

  let bestTime = Infinity;
  let leastCarbon = Infinity;
  let bestTrafficScore = -Infinity;
  let highestOverallScore = -Infinity;
  let longestDistance = -Infinity;

  for (const route of routes) {
    const { details, totalCarbon } = await getRouteDataDetails(
      route.geometry.coordinates,
      route.distance,
      loadWeight,
      fuelType,
      fuelEfficiency
    );

    const score = calculateRouteScore(details, totalCarbon, route.distance, route.duration);

    if (route.duration < bestTime) {
      bestTime = route.duration;
      fastestRoute = { route, details, totalCarbon, score };
    }

    if (totalCarbon < leastCarbon) {
      leastCarbon = totalCarbon;
      ecoFriendlyRoute = { route, details, totalCarbon, score };
    }

    if (score > bestTrafficScore) {
      bestTrafficScore = score;
      leastTrafficRoute = { route, details, totalCarbon, score };
    }

    if (route.distance > longestDistance) {
      longestDistance = route.distance;
      longestRoute = { route, details, totalCarbon, score };
    }

    if (score > highestOverallScore) {
      highestOverallScore = score;
      bestRoute = { route, details, totalCarbon, score };
    }
  }

  return { fastestRoute, ecoFriendlyRoute, leastTrafficRoute, longestRoute, bestRoute };
};

// Routes
app.post('/data', async (req, res) => {
  const { startingPoint, finalDestination, fuelType, vehicleAverage, loadWeight } = req.body;

  try {
    const startCoordinates = await getCoordinatesForCity(startingPoint);
    if (!startCoordinates) return res.status(400).json({ message: 'Invalid starting point' });

    const endCoordinates = await getCoordinatesForCity(finalDestination);
    if (!endCoordinates) return res.status(400).json({ message: 'Invalid final destination' });

    const routes = await getRouteData(startCoordinates.lat, startCoordinates.lon, endCoordinates.lat, endCoordinates.lon);
    if (!routes || routes.length === 0) return res.status(500).json({ message: 'No routes found' });

    const { fastestRoute, ecoFriendlyRoute, leastTrafficRoute, longestRoute, bestRoute } = await findBestRoute(
      routes,
      loadWeight,
      fuelType,
      vehicleAverage
    );
    console.log("Total routes: ",routes);
    

    res.status(200).json({ bestRoute, leastTrafficRoute, ecoFriendlyRoute, fastestRoute, longestRoute });
  } catch (error) {
    console.error('Error in /data route:', error.message);
    res.status(500).json({ message: 'Error in fetching data', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
