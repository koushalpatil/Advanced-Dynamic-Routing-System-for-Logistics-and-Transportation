import React, { useState } from "react";
import { Truck, Plus, Trash2, Zap } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";

interface FormData {
  vehicleType: string;
  fuelType: string;
  loadWeight: string;
  vehicleAverage: string;
  startingPoint: string;
  stops: string[];
  finalDestination: string;
}

export default function VehicleForm() {
  const [formData, setFormData] = useState<FormData>({
    vehicleType: "diesel_Car",
    fuelType: "diesel",
    loadWeight: "",
    vehicleAverage: "",
    startingPoint: "",
    stops: [""],
    finalDestination: "",
  });
  const {setBestRoute,setEcoFriendlyRoute,setLeastTrafficRoute,setFastestRoute} = useAppContext();

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStopChange = (index: number, value: string) => {
    const newStops = [...formData.stops];
    newStops[index] = value;
    setFormData((prev) => ({ ...prev, stops: newStops }));
  };

  const addStop = () => {
    setFormData((prev) => ({ ...prev, stops: [...prev.stops, ""] }));
  };

  const removeStop = (index: number) => {
    const newStops = formData.stops.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, stops: newStops }));
  };

  const handleSubmit = async () => {
    const { vehicleType, fuelType, loadWeight, vehicleAverage, startingPoint, stops, finalDestination } = formData;
  
    // Validation checks
    if (
      !vehicleType.trim() ||
      !fuelType.trim() ||
      !loadWeight.trim() ||
      !vehicleAverage.trim() ||
      !startingPoint.trim() ||
      stops.some((stop) => !stop.trim()) || // Ensure no stop is empty
      !finalDestination.trim()
    ) {
      toast.error("Please fill in all fields before submitting the form.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to calculate routes");
      }
  
      const { bestRoute, fastestRoute, ecoFriendlyRoute, leastTrafficRoute } = await response.json();
      setBestRoute(bestRoute);
      setEcoFriendlyRoute(ecoFriendlyRoute);
      setFastestRoute(fastestRoute);
      setLeastTrafficRoute(leastTrafficRoute);
  
      toast.success("Routes successfully calculated!", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error) {
      console.error((error as Error).message);
      toast.error("Error calculating routes. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };
  

  return (
    <div className="space-y-6 p-6 bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold flex items-center gap-2 text-purple-200">
        <Truck className="h-6 w-6 text-purple-300" />
        Route Planning
      </h2>

      <div className="space-y-4">
        <div className="group">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Vehicle Type
          </label>
          <select
            value={formData.vehicleType}
            onChange={(e) => handleChange("vehicleType", e.target.value)}
            className="w-full py-2 px-3 border-2 border-purple-400 rounded-md bg-gray-800 text-white focus:outline-none focus:border-purple-600"
          >
            <option value="gasoline_car">Gasoline Car</option>
            <option value="diesel_car">Diesel Car</option>
            <option value="electric_car">Electric Car</option>
            <option value="hybrid_car">Hybrid car</option>
            <option value="truck">Truck</option>
          </select>
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Fuel Type
          </label>
          <select
            value={formData.fuelType}
            onChange={(e) => handleChange("fuelType", e.target.value)}
            className="w-full py-2 px-3 border-2 border-purple-400 rounded-md bg-gray-800 text-white focus:outline-none focus:border-purple-600"
          >
            <option value="diesel">Diesel</option>
            <option value="gasoline">Gasoline</option>
            <option value="electric">Electric</option>
          </select>
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Load Weight (kg)
          </label>
          <input
            type="number"
            placeholder="Enter load weight"
            value={formData.loadWeight}
            onChange={(e) => handleChange("loadWeight", e.target.value)}
            className="w-full py-2 px-3 border-2 border-purple-400 rounded-md bg-gray-800 text-white focus:outline-none focus:border-purple-600"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Average of the Vehicle (km/l)
          </label>
          <input
            type="number"
            placeholder="Enter vehicle average"
            value={formData.vehicleAverage}
            onChange={(e) => handleChange("vehicleAverage", e.target.value)}
            className="w-full py-2 px-3 border-2 border-purple-400 rounded-md bg-gray-800 text-white focus:outline-none focus:border-purple-600"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Starting Point
          </label>
          <input
            type="text"
            placeholder="Enter starting location"
            value={formData.startingPoint}
            onChange={(e) => handleChange("startingPoint", e.target.value)}
            className="w-full py-2 px-3 border-2 border-purple-400 rounded-md bg-gray-800 text-white focus:outline-none focus:border-purple-600"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">Stops</label>
            <button
              onClick={addStop}
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Stop
            </button>
          </div>

          {formData.stops.map((stop, index) => (
  <div key={index} className="relative">
    <div className="group">
     
      <label className="block text-sm font-medium text-gray-400 mb-2">
        {`Stop ${index + 1}`} 
      </label>
      
      <input
        type="text"
        placeholder="Enter stop location"
        value={stop}
        onChange={(e) => handleStopChange(index, e.target.value)} 
        className="w-full py-2 px-3 border-2 border-purple-400 rounded-md bg-gray-800 text-white focus:outline-none focus:border-purple-600"
      />
    </div>

    
    {formData.stops.length > 1 && (
      <button
        onClick={() => removeStop(index)} 
        className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-300"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    )}
  </div>
))}
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Final Destination
          </label>
          <input
            type="text"
            placeholder="Enter destination"
            value={formData.finalDestination}
            onChange={(e) => handleChange("finalDestination", e.target.value)}
            className="w-full py-2 px-3 border-2 border-purple-400 rounded-md bg-gray-800 text-white focus:outline-none focus:border-purple-600"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 px-4 mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md transform transition-transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <Zap className="h-5 w-5" />
          Calculate Routes
        </button>
      </div>
    </div>
  );
}