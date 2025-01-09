import React from 'react';
import { Clock, AlertCircle, Route, Gauge } from 'lucide-react';

export default function RouteDetails() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2 text-orange-300">
        <Clock className="h-5 w-5 text-orange-400" />
        Route Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-effect p-4 rounded-lg transform hover:scale-[1.05] transition-all duration-300">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-gray-400">Estimated Time</span>
            </div>
            <span className="text-lg font-semibold text-purple-300">1h 45min</span>
          </div>
        </div>

        <div className="glass-effect p-4 rounded-lg transform hover:scale-[1.05] transition-all duration-300">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Route className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-400">Distance</span>
            </div>
            <span className="text-lg font-semibold text-blue-300">42.5 km</span>
          </div>
        </div>

        <div className="glass-effect p-4 rounded-lg transform hover:scale-[1.05] transition-all duration-300">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-gray-400">Traffic Conditions</span>
            </div>
            <span className="text-lg font-semibold text-orange-300">Moderate</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 p-4 rounded-lg border border-yellow-700/30 transform hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-400">Route Advisory</h3>
            <p className="text-sm text-yellow-300/80">Construction work on Main St. Consider alternative route via Commerce Ave.</p>
          </div>
        </div>
      </div>
    </div>
  );
}