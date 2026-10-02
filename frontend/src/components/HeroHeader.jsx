'use client';

import React from 'react';
import { Compass, ShieldCheck, MapPin } from 'lucide-react';

export default function HeroHeader({ station, offlineMode }) {
  const stationName = station?.name || 'Bharati Research Station';
  const location = station?.location || 'Larsemann Hills, East Antarctica';
  const coords = station?.coordinates ? `${station.coordinates.lat}°S, ${station.coordinates.lon}°E` : '-69.408°S, 76.195°E';

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="flex items-center space-x-2 mb-1">
          <h2 className="font-heading font-extrabold text-xl tracking-tight text-[#2D3436]">
            PRAKASH: AI-DRIVEN POLAR ENERGY INTELLIGENCE
          </h2>
        </div>
        <p className="text-xs text-[#6B7280] font-medium flex flex-wrap items-center gap-2">
          <span>SIH 26061</span>
          <span>•</span>
          <span>Team AntarctiX</span>
          <span>•</span>
          <span>Polar Station Energy Management</span>
          <span>•</span>
          <span className="text-[#0284c7] font-semibold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 inline" /> {stationName} ({location} | {coords})
          </span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {offlineMode && (
          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 font-heading font-bold text-xs rounded-full">
            OFFLINE LOCAL EDGE MODE
          </span>
        )}
        <span className="badge-simulated text-xs py-1 px-3">
          SIMULATED PROTOTYPE DATA
        </span>
      </div>
    </div>
  );
}
