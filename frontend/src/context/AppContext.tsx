import React, { createContext, useState, ReactNode } from "react";

// Define all the interfaces
interface BestRoute {
  route: Route;
  details: Detail[];
  totalCarbon: number;
  score: number;
}

interface Route {
  geometry: Geometry;
  legs: Leg[];
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
}

interface Leg {
    steps: {
      geometry: {
        coordinates: [number, number][]; // Array of latitude and longitude pairs
        type: string; // Type of geometry (e.g., 'LineString')
      };
      distance: number; // Distance covered in this step
      duration: number; // Duration of this step
      name: string; // Name of the road or location
      mode: string; // Mode of travel (e.g., 'driving', 'walking')
      maneuver: {
        location: [number, number]; // Latitude and longitude of the maneuver
        instruction: string; // Text instruction for the maneuver
        type: string; // Type of maneuver (e.g., 'turn', 'merge')
        modifier?: string; // Optional modifier (e.g., 'left', 'right')
      };
    }[]; // Array of steps with detailed structure
    summary: string; // Summary of the leg
    weight: number; // Weight of the leg (used in routing algorithms)
    duration: number; // Duration of the leg in seconds
    distance: number; // Distance of the leg in meters
  }
  

interface Geometry {
    coordinates: [number, number][]; // An array of pairs of numbers representing coordinates (latitude, longitude)
    type: string; // e.g., 'LineString'
  }
  

interface Detail {
  latitude: number;
  longitude: number;
  traffic: Traffic;
  airQuality: AirQuality;
}

interface Traffic {
    flowSegmentData: {
      frc: string; // Freeway Road Classification (FRC)
      currentSpeed: number; // Current speed on the road segment
      freeFlowSpeed: number; // Speed when there is no congestion (free-flow speed)
      currentTravelTime: number; // Current travel time
      freeFlowTravelTime: number; // Travel time under free-flow conditions
      confidence: number; // Confidence level of the data
      roadClosure: boolean; // Indicates if there's a road closure
      coordinates: {
        coordinate: [number, number][]; // An array of coordinate pairs (latitude, longitude)
      };
      '@version': string; // Version of the traffic service
    };
  }
  

  interface AirQuality {
    status: string; // The status of air quality (e.g., 'ok', 'poor')
    data: {
      aqi: number; // Air Quality Index (AQI)
      idx: number; // Unique identifier for the air quality data
      attributions: {
        url: string; // URL for the attribution source
        name: string; // Name of the attribution source
        logo?: string; // Optional logo for the attribution source
      }[]; // Array of attributions related to the data
      city: {
        geo: [number, number]; // Array with latitude and longitude
        name: string; // Name of the city
        url: string; // URL for the city air quality info
        location: string; // Location information (could be empty)
      };
      dominentpol: string; // Dominant pollutant (e.g., 'pm25')
      iaqi: {
        co?: { v: number }; // Carbon monoxide index (CO)
        dew?: { v: number }; // Dew point index (Dew)
        h?: { v: number }; // Humidity index (H)
        no2?: { v: number }; // Nitrogen dioxide index (NO2)
        o3?: { v: number }; // Ozone index (O3)
        pm10?: { v: number }; // PM10 index
        pm25?: { v: number }; // PM2.5 index
        so2?: { v: number }; // Sulfur dioxide index (SO2)
        t?: { v: number }; // Temperature index (T)
        w?: { v: number }; // Wind speed index (W)
      };
      time: {
        s: string; // Timestamp in string format
        tz: string; // Timezone
        v: number; // Timestamp as Unix timestamp (milliseconds)
        iso: string; // ISO 8601 formatted date-time string
      };
      forecast: {
        daily: {
          o3: { day: string; avg: number; max: number; min: number }[]; // Daily O3 forecast
          pm10: { day: string; avg: number; max: number; min: number }[]; // Daily PM10 forecast
          pm25: { day: string; avg: number; max: number; min: number }[]; // Daily PM2.5 forecast
          uvi: { day: string; avg: number; max: number; min: number }[]; // Daily UV index forecast
        };
      };
      debug: {
        sync: string; // Debug sync time
      };
    };
  }
  

// Define the shape of the context
interface AppContextType {
  bestRoute: BestRoute | null;
  setBestRoute: React.Dispatch<React.SetStateAction<BestRoute | null>>;
  ecoFriendlyRoute: BestRoute | null;
  setEcoFriendlyRoute: React.Dispatch<React.SetStateAction<BestRoute | null>>;
  leastTrafficRoute: BestRoute | null;
  setLeastTrafficRoute: React.Dispatch<React.SetStateAction<BestRoute | null>>;
  fastestRoute: BestRoute | null;
  setFastestRoute: React.Dispatch<React.SetStateAction<BestRoute | null>>;
  longestRoute: BestRoute | null;
  setLongestRoute: React.Dispatch<React.SetStateAction<BestRoute | null>>;
  selectedRouteMain: BestRoute | null;
  setSelectedRouteMain: React.Dispatch<React.SetStateAction<BestRoute | null>>;
  
  
}

// Create the context with a default value of undefined
const AppContext = createContext<AppContextType | undefined>(undefined);

// Define the type for the provider's children prop
interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  // Initialize state variables as null because we cannot assign a BestRoute immediately
  const [bestRoute, setBestRoute] = useState<BestRoute | null>(null);
  const [ecoFriendlyRoute, setEcoFriendlyRoute] = useState<BestRoute | null>(null);
  const [leastTrafficRoute, setLeastTrafficRoute] = useState<BestRoute | null>(null);
  const [fastestRoute, setFastestRoute] = useState<BestRoute | null>(null);
  const [longestRoute, setLongestRoute] = useState<BestRoute | null>(null);
  const [selectedRouteMain, setSelectedRouteMain] = useState<BestRoute | null>(null);

  // Context value
  const contextValue: AppContextType = {
    bestRoute,
    setBestRoute,
    ecoFriendlyRoute,
    setEcoFriendlyRoute,
    leastTrafficRoute,
    setLeastTrafficRoute,
    fastestRoute,
    setFastestRoute,
    longestRoute,
    setLongestRoute,
    selectedRouteMain,
    setSelectedRouteMain
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
const useAppContext = (): AppContextType => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export { AppContext, AppContextProvider, useAppContext };