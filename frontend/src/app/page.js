'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import HeroHeader from '../components/HeroHeader';
import DigitalTwinStationView from '../components/DigitalTwinStationView';
import DependencyChainView from '../components/DependencyChainView';
import ForecastChart from '../components/ForecastChart';
import RiskEnginePanel from '../components/RiskEnginePanel';
import KpiCards from '../components/KpiCards';
import EnergyAllocationCard from '../components/EnergyAllocationCard';
import BatteryDeratingCard from '../components/BatteryDeratingCard';
import GeneratorCard from '../components/GeneratorCard';
import ScenarioPanel from '../components/ScenarioPanel';
import AlertsPanel from '../components/AlertsPanel';
import OverviewKpiCards from '../components/OverviewKpiCards';
import Station2DEnergyFlow from '../components/Station2DEnergyFlow';
import AiEnergyStatusCard from '../components/AiEnergyStatusCard';
import DemoController from '../components/DemoController';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeStationId, setActiveStationId] = useState('BHARATI');
  const [activeScenarioId, setActiveScenarioId] = useState('NORMAL');
  const [currentState, setCurrentState] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  const stationMetadata = {
    BHARATI: {
      id: "BHARATI",
      name: "Bharati Research Station",
      location: "Larsemann Hills, East Antarctica",
      coordinates: { lat: -69.408, lon: 76.195 },
      nominal_solar_capacity_kw: 100.0,
      nominal_wind_capacity_kw: 150.0,
      nominal_battery_capacity_kwh: 300.0,
      diesel_generator_rated_kw: 250.0,
      diesel_fuel_reserve_l: 50000.0
    },
    MAITRI: {
      id: "MAITRI",
      name: "Maitri Research Station",
      location: "Schirmacher Oasis, East Antarctica",
      coordinates: { lat: -70.766, lon: 11.733 },
      nominal_solar_capacity_kw: 60.0,
      nominal_wind_capacity_kw: 120.0,
      nominal_battery_capacity_kwh: 200.0,
      diesel_generator_rated_kw: 200.0,
      diesel_fuel_reserve_l: 40000.0
    }
  };

  const loadState = useCallback(async (stationId, scenarioId) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/current-state?station_id=${stationId}&scenario_id=${scenarioId}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentState(data);

        const kpiRes = await fetch(`/api/kpis?station_id=${stationId}&scenario_id=${scenarioId}`);
        if (kpiRes.ok) {
          const kpiData = await kpiRes.json();
          setKpis(kpiData);
        }
      }
    } catch (err) {
      console.error("Failed to load telemetry state from backend:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadState(activeStationId, activeScenarioId);
  }, [activeStationId, activeScenarioId, loadState]);

  const handleStationChange = (stationId) => {
    setActiveStationId(stationId);
  };

  const handleScenarioChange = (scenarioId) => {
    setActiveScenarioId(scenarioId);
  };

  const handleSync = async () => {
    try {
      const res = await fetch('/api/offline/sync', { method: 'POST' });
      if (res.ok) {
        await loadState(activeStationId, activeScenarioId);
      }
    } catch (err) {
      console.error("Failed to sync offline events:", err);
    }
  };

  const handleStepTrigger = (stationId, scenarioId) => {
    setActiveStationId(stationId);
    setActiveScenarioId(scenarioId);
  };

  const currentStation = stationMetadata[activeStationId] || stationMetadata.BHARATI;

  return (
    <div className="min-h-screen bg-white text-[#2D3436] flex flex-col font-inter">
      {/* 64px Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeStationId={activeStationId}
        onStationChange={handleStationChange}
        offlineMode={currentState?.offline_mode || false}
        pendingSyncCount={currentState?.pending_offline_sync_count || 0}
        onSync={handleSync}
        riskStatus={currentState?.shortfall_risk?.status || 'NORMAL'}
        isSimulationMode={activeScenarioId !== 'NORMAL'}
        isDemoRunning={isDemoRunning}
        onToggleDemo={() => setIsDemoRunning(!isDemoRunning)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Hero Overview Header Card */}
        <HeroHeader station={currentStation} offlineMode={currentState?.offline_mode || false} />

        {/* Loading Indicator */}
        {isLoading && !currentState && (
          <div className="p-12 text-center text-[#6B7280] font-heading font-semibold animate-pulse">
            Connecting to PRAKASH Telemetry Engine...
          </div>
        )}

        {currentState && (
          <>
            {/* OVERVIEW TAB: QUICK SUMMARY / COMMAND CENTER */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* 1. COMPACT 4-KPI CARD SUMMARY */}
                <OverviewKpiCards state={currentState} />

                {/* 2. MAIN 2D STATION ENERGY FLOW & AI ENERGY STATUS */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
                  {/* LEFT/CENTER: 2D STATION ENERGY FLOW (8 cols on XL) */}
                  <div className="xl:col-span-8 flex flex-col">
                    <Station2DEnergyFlow telemetry={currentState} />
                  </div>

                  {/* RIGHT: AI ENERGY STATUS CARD (4 cols on XL) */}
                  <div className="xl:col-span-4 flex flex-col">
                    <AiEnergyStatusCard telemetry={currentState} />
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEWS */}
            {activeTab === 'station' && (
              <DigitalTwinStationView
                station={currentStation}
                telemetry={currentState}
                onStationChange={handleStationChange}
              />
            )}

            {activeTab === 'forecast' && (
              <div className="space-y-6">
                <ForecastChart forecasts={currentState.forecasts} telemetry={currentState} />
                <DependencyChainView telemetry={currentState} />
              </div>
            )}

            {activeTab === 'energy' && (
              <div className="space-y-6">
                <EnergyAllocationCard allocation={currentState.allocation} />
                <BatteryDeratingCard batteryDerating={currentState.battery_derating} />
              </div>
            )}

            {activeTab === 'whatif' && (
              <ScenarioPanel
                activeScenarioId={activeScenarioId}
                onSelectScenario={handleScenarioChange}
                beforeVsAfter={currentState.before_vs_after}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#F8F9FA] border-t border-[#E5E7EB] py-4 text-center text-xs text-[#6B7280] font-inter">
        <div className="max-w-[1600px] mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <strong className="font-heading text-[#2D3436]">PRAKASH</strong> | AI-Driven Polar Energy Intelligence Console (Bharati & Maitri Stations)
          </div>
        </div>
      </footer>

      {/* Automated Autopilot Presentation Controller Overlay */}
      <DemoController
        isDemoRunning={isDemoRunning}
        onToggleDemo={() => setIsDemoRunning(!isDemoRunning)}
        onStepTrigger={handleStepTrigger}
      />
    </div>
  );
}
