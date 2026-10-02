'use client';

import React from 'react';
import { Thermometer, Wind, Sun, Globe } from 'lucide-react';

export default function WeatherWidget({ weather, badgeTelemetry }) {
  if (!weather) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
          <Globe className="w-4 h-4 text-blue-600" />
          Antarctic Meteorological & Telemetry Feed
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          {/* Weather Data Source Badge */}
          <span className="polar-badge bg-blue-100 text-blue-800 border border-blue-200">
            {weather.badge_weather || 'NASA/PUBLIC WEATHER DATA'}
          </span>

          {/* Station Telemetry Disclaimer Badge */}
          <span className="polar-badge bg-purple-100 text-purple-800 border border-purple-200">
            {badgeTelemetry || 'SIMULATED STATION TELEMETRY'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Temperature */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-lg">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Temperature</div>
              <div className="text-xl font-bold text-slate-900">{weather.temperature_c}°C</div>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
            {weather.temperature_c <= -20 ? 'Freezing Vortex' : 'Sub-Zero'}
          </span>
        </div>

        {/* Wind Speed */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-600 rounded-lg">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Wind Speed</div>
              <div className="text-xl font-bold text-slate-900">{weather.wind_speed_ms} <span className="text-xs font-normal">m/s</span></div>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
            {(weather.wind_speed_ms * 3.6).toFixed(0)} km/h
          </span>
        </div>

        {/* Solar Radiation */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-lg">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Solar Irradiance</div>
              <div className="text-xl font-bold text-slate-900">{weather.solar_radiation_wm2} <span className="text-xs font-normal">W/m²</span></div>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
            {weather.solar_radiation_wm2 > 200 ? 'Active Solar Window' : 'Low Irradiance'}
          </span>
        </div>
      </div>
    </div>
  );
}
