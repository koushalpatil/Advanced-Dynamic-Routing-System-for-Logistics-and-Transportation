import React from 'react';
import { Leaf, Droplet, Wind, BarChart2 } from 'lucide-react';

export default function EmissionsPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2 text-green-300">
        <Leaf className="h-5 w-5 text-green-400" />
        Environmental Impact
      </h2>
      
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 p-4 rounded-lg border border-green-800/30 transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-300">CO2 Emissions</span>
            <span className="text-lg font-semibold text-green-400">24.5 kg</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full" style={{ width: '65%' }} />
          </div>
          <p className="text-xs text-green-300/70 mt-2">35% below route average</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 p-4 rounded-lg border border-blue-800/30 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300">Fuel Efficiency</span>
              </div>
              <span className="text-lg font-semibold text-blue-400">2.8 L/100km</span>
              <span className="text-xs text-blue-300/70">Optimal range</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 p-4 rounded-lg border border-purple-800/30 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-purple-300">Route Score</span>
              </div>
              <span className="text-lg font-semibold text-purple-400">8.5/10</span>
              <span className="text-xs text-purple-300/70">Eco-friendly route</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 p-4 rounded-lg border border-orange-900/30">
          <div className="flex items-start gap-3">
            <Wind className="h-5 w-5 text-orange-400 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-orange-300">Environmental Alert</h3>
              <p className="text-xs text-orange-300/80 mt-1">High pollution zone ahead. Consider alternative eco-friendly route available.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}