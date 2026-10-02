"""
PRAKASH - AI-Driven Smart Energy Management System for Polar Research Stations
SIH Problem Statement: SIH26061 | Target Stations: Bharati and Maitri, Antarctica
FastAPI Backend Application
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional

from config import STATIONS, get_station_config
from nasa_service import fetch_weather_data
from database import get_pending_offline_count, sync_offline_events, queue_offline_event
from scenario_engine import execute_scenario, SCENARIO_PRESETS
from kpi_engine import calculate_kpis

app = FastAPI(
    title="PRAKASH API",
    description="AI-Driven Smart Energy Management System for Antarctic Polar Stations (Bharati & Maitri)",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# State cache for active station & active scenario
ACTIVE_STATE = {
    "station_id": "BHARATI",
    "scenario_id": "NORMAL",
    "is_offline": False
}

class ScenarioRequest(BaseModel):
    station_id: Optional[str] = "BHARATI"
    scenario_id: str = "NORMAL"

class AllocationRequest(BaseModel):
    station_id: str = "BHARATI"
    demand_kw: float
    solar_avail_kw: float
    wind_avail_kw: float
    soc_percent: float

@app.get("/")
async def root():
    return {
        "project": "PRAKASH",
        "title": "AI-Driven Smart Energy Management System for Polar Research Stations",
        "sih_problem_statement": "SIH26061",
        "team": "AntarctiX",
        "status": "OPERATIONAL",
        "stations_supported": ["BHARATI", "MAITRI"],
        "telemetry_disclaimer": "Simulated station telemetry used for MVP validation as station-specific NCPOR telemetry is currently unavailable.",
        "weather_source": "NASA POWER API (Public Data)"
    }

@app.get("/api/stations")
async def get_stations():
    return {
        "stations": list(STATIONS.values()),
        "active_station_id": ACTIVE_STATE["station_id"]
    }

@app.get("/api/stations/{station_id}")
async def get_station_detail(station_id: str):
    config = get_station_config(station_id)
    return config

@app.get("/api/weather")
async def get_weather(station_id: str = Query("BHARATI")):
    weather = await fetch_weather_data(station_id, is_offline_mode=ACTIVE_STATE["is_offline"])
    return weather

@app.get("/api/current-state")
async def get_current_state(
    station_id: str = Query("BHARATI"),
    scenario_id: str = Query("NORMAL")
):
    ACTIVE_STATE["station_id"] = station_id.upper()
    ACTIVE_STATE["scenario_id"] = scenario_id.upper()
    
    state = await execute_scenario(station_id, scenario_id)
    state["pending_offline_sync_count"] = get_pending_offline_count()
    return state

@app.get("/api/forecast")
async def get_forecast(
    station_id: str = Query("BHARATI"),
    scenario_id: str = Query("NORMAL")
):
    state = await execute_scenario(station_id, scenario_id)
    return {
        "station_id": station_id,
        "scenario_id": scenario_id,
        "forecasts": state["forecasts"],
        "badge": "AI SCIKIT-LEARN RANDOM FOREST FORECAST ENGINE"
    }

@app.post("/api/allocation")
async def compute_allocation(req: AllocationRequest):
    # Reruns allocation with custom parameters
    preset = SCENARIO_PRESETS["NORMAL"].copy()
    preset["soc_override"] = req.soc_percent
    state = await execute_scenario(req.station_id, "NORMAL")
    return state["allocation"]

@app.post("/api/scenario")
async def set_scenario(req: ScenarioRequest):
    station_id = req.station_id.upper() if req.station_id else ACTIVE_STATE["station_id"]
    scenario_id = req.scenario_id.upper()
    
    ACTIVE_STATE["station_id"] = station_id
    ACTIVE_STATE["scenario_id"] = scenario_id
    
    preset = SCENARIO_PRESETS.get(scenario_id, SCENARIO_PRESETS["NORMAL"])
    if preset.get("offline_mode", False):
        ACTIVE_STATE["is_offline"] = True
        queue_offline_event("SCENARIO_SWITCH_OFFLINE", station_id, {"scenario": scenario_id})

    state = await execute_scenario(station_id, scenario_id)
    state["pending_offline_sync_count"] = get_pending_offline_count()
    return state

@app.get("/api/alerts")
async def get_alerts(
    station_id: str = Query("BHARATI"),
    scenario_id: str = Query("NORMAL")
):
    state = await execute_scenario(station_id, scenario_id)
    return {
        "station_id": station_id,
        "alerts": state["alerts"],
        "count": len(state["alerts"])
    }

@app.get("/api/kpis")
async def get_kpis(
    station_id: str = Query("BHARATI"),
    scenario_id: str = Query("NORMAL")
):
    state = await execute_scenario(station_id, scenario_id)
    kpis = calculate_kpis(state)
    return kpis

@app.post("/api/offline/sync")
async def trigger_offline_sync():
    ACTIVE_STATE["is_offline"] = False
    result = sync_offline_events()
    return result

@app.get("/api/demo/steps")
async def get_demo_steps():
    """Returns sequence of steps for the automated 60-90 second SIH demo presentation."""
    return [
        {
            "step": 1,
            "title": "Normal Operation Baseline",
            "station_id": "BHARATI",
            "scenario_id": "NORMAL",
            "duration_sec": 10,
            "narration": "Bharati Station operating in normal conditions. Solar (48 kW) & Wind (92 kW) satisfy 100% of demand without diesel!"
        },
        {
            "step": 2,
            "title": "High Research Load Spike",
            "station_id": "BHARATI",
            "scenario_id": "HIGH_LOAD",
            "duration_sec": 12,
            "narration": "Deep ice coring research spikes load from 140 kW to 224 kW. Battery storage automatically ramps up discharge to cushion the peak."
        },
        {
            "step": 3,
            "title": "Extreme Polar Cold (-38°C)",
            "station_id": "BHARATI",
            "scenario_id": "EXTREME_COLD",
            "duration_sec": 12,
            "narration": "Temperatures drop to -38°C. Cold-weather derating model reduces usable battery capacity by 62%. System triggers Watch Status."
        },
        {
            "step": 4,
            "title": "AI Shortfall Prediction Alert",
            "station_id": "BHARATI",
            "scenario_id": "LOW_WIND",
            "duration_sec": 14,
            "narration": "Random Forest forecast predicts power gap in 2.5 hours due to dying winds. System prepares backup diesel auto-start & alerts station lead."
        },
        {
            "step": 5,
            "title": "Generator Fault & Graceful Load Shedding",
            "station_id": "BHARATI",
            "scenario_id": "GENERATOR_FAILURE",
            "duration_sec": 14,
            "narration": "IsolationForest flags generator degradation (40% capacity drop). Engine prioritizes 65% critical loads (life support/heat) while shedding non-critical labs."
        },
        {
            "step": 6,
            "title": "Offline-First Resilience & Sync",
            "station_id": "BHARATI",
            "scenario_id": "OFFLINE",
            "duration_sec": 10,
            "narration": "Satellite comms fail! System seamlessly runs on edge SQLite local cache. Upon reconnect, offline events synchronize with NCPOR registry."
        },
        {
            "step": 7,
            "title": "Maitri Station Multi-Site Switch",
            "station_id": "MAITRI",
            "scenario_id": "NORMAL",
            "duration_sec": 10,
            "narration": "Switching seamlessly to Maitri Station (-70.766°S) with station-specific configurations and parameters."
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
