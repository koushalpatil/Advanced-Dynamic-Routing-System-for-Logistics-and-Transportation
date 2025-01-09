import React, { useState } from 'react';
import { Truck, Navigation, Leaf, Clock, AlertCircle, Sparkles } from 'lucide-react';
import VehicleForm from './components/VehicleForm';
import RouteMap from './components/RouteMap';
import EmissionsPanel from './components/EmissionsPanel';
import RouteDetails from './components/RouteDetails';

export default function App() {
  const [activeTab, setActiveTab] = useState('route');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="glass-effect border-b border-purple-900/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 animate-float">
              <div className="p-3 rounded-full bg-purple-600/20">
                <Truck className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  FedEx Dynamic Router
                </h1>
                <p className="text-sm text-gray-400">Smart. Efficient. Eco-friendly.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center px-4 py-2 rounded-full glass-effect">
                <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
                <span className="text-purple-300">AI-Powered Routes</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-effect rounded-xl p-6 transform hover:scale-[1.02] transition-all duration-300">
              <VehicleForm />
            </div>
            <div className="glass-effect rounded-xl p-6 transform hover:scale-[1.02] transition-all duration-300">
              <EmissionsPanel />
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-effect rounded-xl p-6 min-h-[500px] transform hover:scale-[1.01] transition-all duration-300">
              <RouteMap />
            </div>
            <div className="glass-effect rounded-xl p-6 transform hover:scale-[1.01] transition-all duration-300">
              <RouteDetails />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}