import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationInputProps {
  label: string;
  placeholder: string;
}

export function LocationInput({ label, placeholder }: LocationInputProps) {
  return (
    <div className="group">
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          className="w-full input-style pl-10 group-hover:ring-1 group-hover:ring-purple-500/50"
          placeholder={placeholder}
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
      </div>
    </div>
  );
}