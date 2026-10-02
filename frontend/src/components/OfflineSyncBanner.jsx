'use client';

import React from 'react';
import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

export default function OfflineSyncBanner({
  offlineMode,
  pendingSyncCount,
  onSync
}) {
  if (!offlineMode && pendingSyncCount === 0) return null;

  return (
    <div className={`p-4 rounded-xl border mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm ${
      offlineMode
        ? 'bg-amber-500/10 border-amber-500/30 text-amber-900'
        : 'bg-blue-500/10 border-blue-500/30 text-blue-900'
    }`}>
      <div className="flex items-center space-x-3">
        {offlineMode ? (
          <div className="p-2 bg-amber-500 text-slate-950 rounded-lg">
            <WifiOff className="w-5 h-5" />
          </div>
        ) : (
          <div className="p-2 bg-blue-500 text-white rounded-lg">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
        )}
        <div>
          <h3 className="text-sm font-bold">
            {offlineMode
              ? '🟠 OFFLINE — LOCAL EDGE OPERATION ACTIVE'
              : `🔵 ONLINE — ${pendingSyncCount} EVENTS PENDING SYNCHRONIZATION`}
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            {offlineMode
              ? 'Satellite connection unavailable. Using cached NASA weather and local SQLite buffer. Actions are queued locally.'
              : 'Connection restored. Telemetry logs and scenario events are queued in local SQLite storage ready for sync.'}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {pendingSyncCount > 0 && (
          <button
            onClick={onSync}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-2 shadow"
          >
            <RefreshCw className="w-4 h-4" />
            <span>SYNC {pendingSyncCount} EVENTS NOW</span>
          </button>
        )}
      </div>
    </div>
  );
}
