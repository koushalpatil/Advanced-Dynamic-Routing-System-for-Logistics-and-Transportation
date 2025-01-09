import React, { useState, useEffect, useRef } from "react";
import { Navigation, Sun, Cloud, CloudLightning, CloudDrizzle, Zap, Leaf, Gauge, CloudSun, Skull } from "lucide-react"; // Import icons
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useAppContext } from "../context/AppContext";

mapboxgl.accessToken =
  "pk.eyJ1Ijoia291c2hhbHBhdGlsIiwiYSI6ImNseHdvc3RrdzJpNngycXF5MWNwaTk4c3kifQ.Oy-j3BN6ilOFgcLS_OJO6Q";

interface RouteData {
  route: Route;
  details: Detail[];
  totalCarbon: number;
  score: number;
}

interface Route {
  geometry: GeoJSON.LineString;
  legs: Leg[];
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
}

interface Leg {
  steps: {
    geometry: {
      coordinates: [number, number][];
      type: "LineString";
    };
    distance: number;
    duration: number;
    name: string;
    mode: string;
    maneuver: {
      location: [number, number];
      instruction: string;
      type: string;
      modifier?: string;
    };
  }[];
  summary: string;
  weight: number;
  duration: number;
  distance: number;
}

interface Detail {
  latitude: number;
  longitude: number;
  traffic: Traffic;
  airQuality: AirQuality;
}

interface Traffic {
  flowSegmentData: {
    currentSpeed: number;
    freeFlowSpeed: number;
    currentTravelTime: number;
    freeFlowTravelTime: number;
  };
}

interface AirQuality {
  data: {
    aqi: number;
    city: { name: string };
    dominentpol: string;
  };
}

interface AppContext {
  bestRoute: RouteData;
  ecoFriendlyRoute: RouteData;
  fastestRoute: RouteData;
  leastTrafficRoute: RouteData;
  longestRoute: RouteData;
}

export default function RouteMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedRoute, setSelectedRoute] = useState(0);

  const {
    bestRoute,
    ecoFriendlyRoute,
    fastestRoute,
    leastTrafficRoute,
    
  } = useAppContext() as AppContext;

  const routeOptions = [
    { name: "Fastest Route", data: fastestRoute },
    { name: "Eco-Friendly Route", data: ecoFriendlyRoute },
    { name: "Least Traffic", data: leastTrafficRoute },
    { name: "Best Route", data: bestRoute },

  ];

  const getWeatherIcon = (aqi: number) => {
    if (aqi <= 30) {
      return <Sun className="h-5 w-5 text-yellow-400" />; 
    } else if (aqi <= 60) {
      return <Sun className="h-5 w-5 text-yellow-300" />; 
    } else if (aqi <= 90) {
      return <CloudSun className="h-5 w-5 text-gray-300" />; 
    } else if (aqi <= 120) {
      return <Cloud className="h-5 w-5 text-gray-400" />; 
    } else if (aqi <= 160) {
      return <CloudDrizzle className="h-5 w-5 text-blue-400" />; 
    } else if (aqi <= 200) {
      return <CloudLightning className="h-5 w-5 text-orange-400" />; 
    } else if (aqi <= 250) {
      return <Zap className="h-5 w-5 text-purple-400" />; 
    } else {
      return <Skull className="h-5 w-5 text-red-600" />; 
    }
  };


  const getCarbonIcon = (carbon: number) => {
    if (carbon < 100) return <Leaf className="h-5 w-5 text-green-400" />;
    if (carbon < 200) return <Gauge className="h-5 w-5 text-yellow-400" />;
    return <Gauge className="h-5 w-5 text-red-400" />;
  };

  const showPopup = (index: number, lngLat: mapboxgl.LngLatLike) => {
    const route = routeOptions[index];

    const popupContent = `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 13px;
        background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
        color: #e0e0e0;
        padding: 12px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
        text-align: center;
        max-width: 220px;
        border: 2px solid rgba(255, 255, 255, 0.1);
      ">
        <h3 style="
          font-size: 18px;
          font-weight: bold;
          margin: 0 0 6px 0;
          text-transform: capitalize;
          color: #ffffff;
          letter-spacing: 0.5px;
        ">
          ${route.name}
        </h3>
        <p style="
          margin: 6px 0;
          font-size: 13px;
          color: #b0b0b0;
        ">
          <strong>Distance:</strong> ${(route.data.route.distance / 1000).toFixed(1)} km
        </p>
        <p style="
          margin: 6px 0;
          font-size: 13px;
          color: #b0b0b0;
        ">
          <strong>Duration:</strong> ${(route.data.route.duration / 3600).toFixed(1)} hrs
        </p>
      </div>
    `;


    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
      offset: 10,
    })
      .setLngLat(lngLat)
      .setHTML(popupContent)
      .addTo(mapRef.current!);

    setTimeout(() => {
      popup.remove();
    }, 4000);
  };



  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [74.475786, 19.76551],
        zoom: 5,
      });

      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
      mapRef.current.addControl(new mapboxgl.FullscreenControl());

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
      });
      mapRef.current.addControl(geocoder);

      return () => {
        mapRef.current?.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    routeOptions.forEach((route, index) => {
      if (!route?.data?.route?.geometry?.coordinates) return;

      const routeData = route.data.route.geometry;

      if (mapRef.current.getSource(`route-${index}`)) {
        mapRef.current.getSource(`route-${index}`).setData({
          type: "Feature",
          geometry: routeData,
        });
      } else {
        mapRef.current.addSource(`route-${index}`, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: routeData,
          },
        });
      }

      if (mapRef.current.getLayer(`route-layer-${index}`)) {
        mapRef.current.setPaintProperty(
          `route-layer-${index}`,
          "line-opacity",
          selectedRoute === index ? 1 : 0.3
        );
        mapRef.current.setPaintProperty(
          `route-layer-${index}`,
          "line-color",
          selectedRoute === index ? "#1DB954" : "#888"
        );
      } else {
        mapRef.current.addLayer({
          id: `route-layer-${index}`,
          type: "line",
          source: `route-${index}`,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": selectedRoute === index ? "#1DB954" : "#888",
            "line-width": 5,
            "line-opacity": selectedRoute === index ? 1 : 0.3,
          },
        });

        mapRef.current.on("click", `route-layer-${index}`, (e) => {
          setSelectedRoute(index);
          showPopup(index, e.lngLat);
        });
      }

      const start = routeData.coordinates[0];
      const end = routeData.coordinates[routeData.coordinates.length - 1];

      new mapboxgl.Marker({ color: "green" }).setLngLat(start).addTo(mapRef.current);
      new mapboxgl.Marker({ color: "red" }).setLngLat(end).addTo(mapRef.current);

      if (selectedRoute === index) {
        const bounds = routeData.coordinates.reduce(
          (bounds, coord) => bounds.extend(coord),
          new mapboxgl.LngLatBounds(routeData.coordinates[0], routeData.coordinates[0])
        );
        mapRef.current.fitBounds(bounds, { padding: 50 });
      }
    });
  }, [selectedRoute]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-300">
          <Navigation className="h-6 w-6 text-blue-400" />
          Available Routes
        </h2>
        <div className="flex gap-3">
          {routeOptions.map((route, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedRoute(index);
                const startLngLat = route.data.route.geometry.coordinates[0];
                showPopup(index, startLngLat);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedRoute === index
                ? "bg-blue-500/30 text-blue-300"
                : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                }`}
            >
              {route.name}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={mapContainerRef}
        className="relative h-[450px] rounded-lg overflow-hidden border border-gray-700/50 shadow-md"
      ></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {routeOptions.map(
          (route, index) =>
            route.data && (
              <div
                key={index}
                className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-lg ${selectedRoute === index
                  ? "border-blue-500 bg-blue-900/20"
                  : "border-gray-700 bg-gray-800 hover:border-gray-600"
                  }`}
                onClick={() => {
                  setSelectedRoute(index);
                  const startLngLat = route.data.route.geometry.coordinates[0];
                  showPopup(index, startLngLat);
                }}
              >
                <h3 className="text-lg font-bold text-gray-300 mb-2">{route.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    // Extract all AQI values and calculate the average
                    const aqiValues = route.data.details.map((detail) => detail.airQuality.data.aqi);
                    const avgAqi = aqiValues.reduce((sum, aqi) => sum + aqi, 0) / aqiValues.length;

                    // Pass the average AQI to the weather icon function
                    return getWeatherIcon(avgAqi);
                  })()}
                  <span className="text-sm text-gray-400">
                    Weather:
                    {(() => {
                      // Extract all AQI values and calculate the average
                      const aqiValues = route.data.details.map((detail) => detail.airQuality.data.aqi);
                      const avgAqi = aqiValues.reduce((sum, aqi) => sum + aqi, 0) / aqiValues.length;

                      // Adjust the thresholds for more precision
                      if (avgAqi <= 30) return 'Clear and Sunny';
                      if (avgAqi <= 60) return 'Mostly Clear';
                      if (avgAqi <= 90) return 'Partly Cloudy';
                      if (avgAqi <= 120) return 'Cloudy';
                      if (avgAqi <= 160) return 'Drizzle Expected';
                      if (avgAqi <= 200) return 'Stormy';
                      if (avgAqi <= 250) return 'Hazardous Weather';
                      return 'Severe Conditions';
                    })()}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  {getCarbonIcon(route.data.totalCarbon)}
                  <span className="text-sm text-gray-400">
                    Carbon Consumption: {(route.data.totalCarbon/1000).toFixed(1)} kg/km
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Gauge className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm text-gray-400">Distance: {(route.data.route.distance / 1000).toFixed(1)} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-red-400" />
                  <span className="text-sm text-gray-400">
                    Duration: {(route.data.route.duration / 3600).toFixed(1)} hrs
                  </span>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}