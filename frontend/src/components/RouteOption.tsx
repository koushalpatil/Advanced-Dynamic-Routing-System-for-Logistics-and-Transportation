import React from 'react';
import { Clock, Route as RouteIcon, Leaf, Activity } from 'lucide-react';

interface RouteOptionProps {
  route: {
    name: string;
    duration: string;
    distance: string;
    emissions: string;
    traffic: string;
    trafficColor: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export function RouteOption({ route, isSelected, onClick }: RouteOptionProps) {
  return (
    <div
      onClick={onClick}
      className={`glass-effect p-4 rounded-lg cursor-pointer transform hover:scale-[1.02] transition-all duration-300 ${
        isSelected ? 'ring-2 ring-blue-500/50' : ''
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-blue-300">{route.name}</h3>
          <span className={`text-xs font-medium ${route.trafficColor}`}>
            {route.traffic} traffic
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-400" />
            <span className="text-gray-300">{route.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <RouteIcon className="h-4 w-4 text-blue-400" />
            <span className="text-gray-300">{route.distance}</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-green-400" />
            <span className="text-gray-300">{route.emissions}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-orange-400" />
            <span className="text-gray-300">Score: 8.5</span>
          </div>
        </div>
      </div>
    </div>
  );
}