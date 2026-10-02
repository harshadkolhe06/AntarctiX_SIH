'use client';

import React from 'react';
import { Compass, MapPin, Battery, Sun, Wind, Flame } from 'lucide-react';

export default function StationSelector({
  stations,
  activeStationId,
  onSelectStation
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
            <Compass className="w-4 h-4 text-cyan-600" />
            Polar Research Station Target Selector
          </h2>
          <p className="text-xs text-slate-500">
            Switch between Indian Antarctic research stations. Telemetry parameters reload dynamically.
          </p>
        </div>

        {/* Station Switcher Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200">
          {stations.map((st) => {
            const isActive = st.id === activeStationId;
            return (
              <button
                key={st.id}
                onClick={() => onSelectStation(st.id)}
                className={`px-5 py-2 rounded-md text-xs font-bold transition-all flex items-center space-x-2 ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{st.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Station Specs */}
      {stations.map((st) => {
        if (st.id !== activeStationId) return null;
        return (
          <div key={st.id} className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-800 text-sm">{st.name}</span>
              <span className="ml-2 text-slate-500">({st.location} | {st.coordinates.lat}°S, {st.coordinates.lon}°E)</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-700">
              <div className="flex items-center space-x-1" title="Nominal Solar PV Capacity">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Solar: <strong>{st.nominal_solar_capacity_kw} kW</strong></span>
              </div>

              <div className="flex items-center space-x-1" title="Nominal Wind Turbine Capacity">
                <Wind className="w-3.5 h-3.5 text-cyan-500" />
                <span>Wind: <strong>{st.nominal_wind_capacity_kw} kW</strong></span>
              </div>

              <div className="flex items-center space-x-1" title="Nominal Battery Storage Capacity">
                <Battery className="w-3.5 h-3.5 text-emerald-500" />
                <span>Battery: <strong>{st.nominal_battery_capacity_kwh} kWh</strong></span>
              </div>

              <div className="flex items-center space-x-1" title="Diesel Generator Rated Capacity">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>Diesel Gen: <strong>{st.diesel_generator_rated_kw} kW</strong></span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
