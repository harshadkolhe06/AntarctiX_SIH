'use client';

import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipForward, Sparkles, X } from 'lucide-react';

const DEMO_STEPS = [
  {
    step: 1,
    title: "1. Bharati Station Normal Baseline",
    station_id: "BHARATI",
    scenario_id: "NORMAL",
    duration_sec: 10,
    narration: "Bharati Station operating in normal conditions. Solar (48 kW) & Wind (92 kW) satisfy 100% of demand without diesel!"
  },
  {
    step: 2,
    title: "2. High Research Load Spike",
    station_id: "BHARATI",
    scenario_id: "HIGH_LOAD",
    duration_sec: 12,
    narration: "Ice-coring operations spike load from 140 kW to 224 kW. Battery storage automatically discharges to cushion the load spike."
  },
  {
    step: 3,
    title: "3. Extreme Polar Cold (-38°C)",
    station_id: "BHARATI",
    scenario_id: "EXTREME_COLD",
    duration_sec: 12,
    narration: "Temperatures drop to -38°C. Cold-weather derating model reduces usable battery capacity by 62%."
  },
  {
    step: 4,
    title: "4. AI Shortfall Prediction Alert",
    station_id: "BHARATI",
    scenario_id: "LOW_WIND",
    duration_sec: 14,
    narration: "Random Forest forecast predicts power deficit in 2.5 hours due to dying winds. System alerts station lead & prepares diesel backup."
  },
  {
    step: 5,
    title: "5. Generator Fault & Critical Load Shedding",
    station_id: "BHARATI",
    scenario_id: "GENERATOR_FAILURE",
    duration_sec: 14,
    narration: "IsolationForest detects generator degradation (40% capacity drop). Engine prioritizes 65% critical loads (life support/heat) while shedding aux labs."
  },
  {
    step: 6,
    title: "6. Offline-First Local Resiliency & Sync",
    station_id: "BHARATI",
    scenario_id: "OFFLINE",
    duration_sec: 10,
    narration: "Satellite link severed! System runs seamlessly on local SQLite edge cache. Upon reconnection, offline events flush to central NCPOR registry."
  },
  {
    step: 7,
    title: "7. Multi-Station Switch (Maitri Station)",
    station_id: "MAITRI",
    scenario_id: "NORMAL",
    duration_sec: 10,
    narration: "Seamlessly switching control to Maitri Station (-70.766°S) with station-specific configurations and parameters."
  }
];

export default function DemoController({
  isDemoRunning,
  onToggleDemo,
  onStepTrigger
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(DEMO_STEPS[0].duration_sec);

  useEffect(() => {
    let timer = null;
    if (isDemoRunning) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            const nextIdx = (currentStepIndex + 1) % DEMO_STEPS.length;
            setCurrentStepIndex(nextIdx);
            const nextStep = DEMO_STEPS[nextIdx];
            onStepTrigger(nextStep.station_id, nextStep.scenario_id);
            return nextStep.duration_sec;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isDemoRunning, currentStepIndex, onStepTrigger]);

  if (!isDemoRunning) return null;

  const currentStep = DEMO_STEPS[currentStepIndex];
  const progressPct = ((currentStep.duration_sec - secondsRemaining) / currentStep.duration_sec) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-white border border-[#BCE1F4] rounded-xl p-4 shadow-2xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#0284c7] animate-spin" />
          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#2D3436]">
            SIH LIVE DEMO PRESENTATION AUTOPILOT
          </h4>
        </div>
        <span className="telemetry-num text-xs font-bold bg-[#BCE1F4] text-[#2D3436] px-2 py-0.5 rounded">
          {secondsRemaining}s
        </span>
      </div>

      <h3 className="font-heading font-bold text-sm text-[#2D3436] mb-1">
        {currentStep.title}
      </h3>
      <p className="text-xs text-[#6B7280] mb-3 leading-relaxed">
        "{currentStep.narration}"
      </p>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden mb-3">
        <div className="bg-[#0284c7] h-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between text-xs">
        <div className="text-[11px] text-[#6B7280] font-heading font-semibold">
          Step {currentStepIndex + 1} of {DEMO_STEPS.length}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const nextIdx = (currentStepIndex + 1) % DEMO_STEPS.length;
              setCurrentStepIndex(nextIdx);
              const nextStep = DEMO_STEPS[nextIdx];
              onStepTrigger(nextStep.station_id, nextStep.scenario_id);
              setSecondsRemaining(nextStep.duration_sec);
            }}
            className="px-2.5 py-1 bg-[#F8F9FA] hover:bg-[#E5E7EB] text-[#2D3436] rounded font-heading font-bold flex items-center space-x-1 border border-[#E5E7EB]"
          >
            <span>Skip Step</span>
            <SkipForward className="w-3 h-3" />
          </button>

          <button
            onClick={onToggleDemo}
            className="px-3 py-1 bg-[#EF4444] hover:bg-red-700 text-white rounded font-heading font-bold shadow-sm"
          >
            EXIT DEMO
          </button>
        </div>
      </div>
    </div>
  );
}
