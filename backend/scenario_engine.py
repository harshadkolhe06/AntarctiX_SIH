"""
PRAKASH - What-If Scenario Engine
Executes complete before-and-after re-evaluations for user scenarios.
"""

from typing import Dict, Any, List
from config import get_station_config
from nasa_service import fetch_weather_data
from battery_engine import calculate_battery_derating
from anomaly_engine import generator_detector
from forecast_engine import forecaster
from allocation_engine import allocate_energy_sources
from shortfall_engine import evaluate_shortfall_risk

SCENARIO_PRESETS: Dict[str, Dict[str, Any]] = {
    "NORMAL": {
        "id": "NORMAL",
        "name": "Normal Operation",
        "description": "Nominal Antarctic operational conditions with balanced renewable generation and baseline load.",
        "temp_offset": 0.0,
        "wind_mult": 1.0,
        "solar_mult": 1.0,
        "load_mult": 1.0,
        "soc_override": 78.0,
        "generator_manual_failure": False,
        "offline_mode": False
    },
    "LOW_WIND": {
        "id": "LOW_WIND",
        "name": "5-Day Low Wind",
        "description": "Prolonged polar high-pressure ridge causes wind speed to drop to 1.8 m/s, severely bottlenecking wind turbine generation.",
        "temp_offset": -2.0,
        "wind_mult": 0.12,
        "solar_mult": 0.9,
        "load_mult": 1.05,
        "soc_override": 52.0,
        "generator_manual_failure": False,
        "offline_mode": False
    },
    "EXTREME_COLD": {
        "id": "EXTREME_COLD",
        "name": "Extreme Cold Snap (-38°C)",
        "description": "Severe polar vortex drop down to -38°C. Thermal heating loads spike and battery usable capacity derates significantly (~62%).",
        "temp_offset": -20.0,
        "wind_mult": 1.1,
        "solar_mult": 0.8,
        "load_mult": 1.35,
        "soc_override": 65.0,
        "generator_manual_failure": False,
        "offline_mode": False
    },
    "HIGH_LOAD": {
        "id": "HIGH_LOAD",
        "name": "High Research Load",
        "description": "Concurrent deep ice-coring drill ops and high-frequency ionospheric radar sweeps increase station demand by +60%.",
        "temp_offset": 0.0,
        "wind_mult": 0.9,
        "solar_mult": 1.0,
        "load_mult": 1.60,
        "soc_override": 60.0,
        "generator_manual_failure": False,
        "offline_mode": False
    },
    "LOW_SOLAR": {
        "id": "LOW_SOLAR",
        "name": "Low Solar / Blizzard",
        "description": "Dense blizzard cloud cover reduces solar irradiance by 92% and forces reliance on wind and battery reserves.",
        "temp_offset": -5.0,
        "wind_mult": 1.4,
        "solar_mult": 0.08,
        "load_mult": 1.15,
        "soc_override": 55.0,
        "generator_manual_failure": False,
        "offline_mode": False
    },
    "GENERATOR_FAILURE": {
        "id": "GENERATOR_FAILURE",
        "name": "Generator #1 Mechanical Failure",
        "description": "Primary diesel generator unit trips due to fuel injector failure. Rated capacity drops from 250 kW to 100 kW.",
        "temp_offset": -3.0,
        "wind_mult": 0.5,
        "solar_mult": 0.4,
        "load_mult": 1.25,
        "soc_override": 45.0,
        "generator_manual_failure": True,
        "offline_mode": False
    },
    "OFFLINE": {
        "id": "OFFLINE",
        "name": "Communication / Network Outage",
        "description": "Satellite link connection severed. System transitions to offline-first local edge execution mode.",
        "temp_offset": -1.0,
        "wind_mult": 1.0,
        "solar_mult": 1.0,
        "load_mult": 1.0,
        "soc_override": 75.0,
        "generator_manual_failure": False,
        "offline_mode": True
    }
}

async def execute_scenario(station_id: str, scenario_id: str) -> Dict[str, Any]:
    preset = SCENARIO_PRESETS.get(scenario_id.upper(), SCENARIO_PRESETS["NORMAL"])
    
    # 1. Compute Normal Baseline
    baseline_state = await _compute_state_for_parameters(station_id, SCENARIO_PRESETS["NORMAL"])
    
    # 2. Compute Scenario State
    scenario_state = await _compute_state_for_parameters(station_id, preset)

    # 3. Assemble Before vs After Comparison
    before_vs_after = {
        "scenario_name": preset["name"],
        "scenario_id": preset["id"],
        "description": preset["description"],
        "before": {
            "demand_kw": baseline_state["current_demand_kw"],
            "solar_kw": baseline_state["current_solar_kw"],
            "wind_kw": baseline_state["current_wind_kw"],
            "battery_kw": baseline_state["allocation"]["battery_used_kw"],
            "diesel_kw": baseline_state["allocation"]["diesel_used_kw"],
            "battery_effective_usable_kwh": baseline_state["battery_derating"]["effective_usable_capacity_kwh"],
            "generator_effective_kw": baseline_state["generator_health"]["effective_capacity_kw"],
            "risk_status": baseline_state["shortfall_risk"]["status"],
            "renewable_share_pct": baseline_state["allocation"]["renewable_share_pct"]
        },
        "after": {
            "demand_kw": scenario_state["current_demand_kw"],
            "solar_kw": scenario_state["current_solar_kw"],
            "wind_kw": scenario_state["current_wind_kw"],
            "battery_kw": scenario_state["allocation"]["battery_used_kw"],
            "diesel_kw": scenario_state["allocation"]["diesel_used_kw"],
            "battery_effective_usable_kwh": scenario_state["battery_derating"]["effective_usable_capacity_kwh"],
            "generator_effective_kw": scenario_state["generator_health"]["effective_capacity_kw"],
            "risk_status": scenario_state["shortfall_risk"]["status"],
            "renewable_share_pct": scenario_state["allocation"]["renewable_share_pct"]
        }
    }

    scenario_state["before_vs_after"] = before_vs_after
    return scenario_state

async def _compute_state_for_parameters(station_id: str, preset: Dict[str, Any]) -> Dict[str, Any]:
    config = get_station_config(station_id)
    
    # Weather
    weather = await fetch_weather_data(station_id, is_offline_mode=preset["offline_mode"])
    adjusted_temp = weather["temperature_c"] + preset["temp_offset"]
    adjusted_wind = max(0.0, weather["wind_speed_ms"] * preset["wind_mult"])
    adjusted_solar_rad = max(0.0, weather["solar_radiation_wm2"] * preset["solar_mult"])

    # Current telemetry generation
    station_base_demand = config["baseline_demand_kw"] * preset["load_mult"]
    current_demand = round(station_base_demand, 1)

    solar_cap = config["nominal_solar_capacity_kw"]
    wind_cap = config["nominal_wind_capacity_kw"]

    current_solar = round(min(solar_cap, (adjusted_solar_rad / 600.0) * solar_cap * preset["solar_mult"]), 1)
    current_wind = round(min(wind_cap, ((adjusted_wind - 3.0) / 11.0)**2 * wind_cap) if adjusted_wind > 3 else 0.0, 1)

    # Battery derating
    soc = preset["soc_override"]
    nominal_battery = config["nominal_battery_capacity_kwh"]
    battery = calculate_battery_derating(adjusted_temp, nominal_battery, soc)

    # Generator anomaly health
    gen_rated = config["diesel_generator_rated_kw"]
    gen_temp = 108.0 if preset["generator_manual_failure"] else (78.0 + (current_demand / gen_rated) * 12.0)
    gen_health = generator_detector.evaluate_generator(
        power_kw=min(current_demand, gen_rated),
        rated_capacity_kw=gen_rated,
        engine_temp_c=gen_temp,
        runtime_hours=240.0,
        fuel_consumption_lph=25.0,
        is_manual_failure=preset["generator_manual_failure"]
    )

    # 6-Hour ML Forecast
    forecasts = forecaster.forecast_6hours(
        station_id=station_id,
        current_temp=adjusted_temp,
        current_wind=adjusted_wind,
        current_solar=current_solar,
        scenario_modifier=preset
    )

    # Energy Source Allocation
    allocation = allocate_energy_sources(
        demand_kw=current_demand,
        solar_avail_kw=current_solar,
        wind_avail_kw=current_wind,
        battery_usable_kwh=battery["effective_usable_capacity_kwh"],
        diesel_rated_capacity_kw=gen_rated,
        generator_health_factor=gen_health["health_factor"],
        critical_load_ratio=config["critical_load_ratio"]
    )

    # Shortfall Detection
    shortfall = evaluate_shortfall_risk(
        forecasts=forecasts,
        battery_usable_kwh=battery["effective_usable_capacity_kwh"],
        effective_diesel_capacity_kw=gen_health["effective_capacity_kw"],
        critical_load_ratio=config["critical_load_ratio"]
    )

    total_current_supply = round(allocation["total_supplied_kw"], 1)
    power_headroom = round(max(0.0, (current_solar + current_wind + battery["max_discharge_kw"] + gen_health["effective_capacity_kw"]) - current_demand), 1)

    # Alerts List
    alerts = []
    if battery["derating_pct"] >= 30:
        alerts.append({
            "id": "alt_bat_derate",
            "type": "warning",
            "title": f"Battery Usable Capacity Reduced by {battery['derating_pct']}%",
            "message": f"Extreme cold ({adjusted_temp:.1f}°C) derated usable storage to {battery['effective_usable_capacity_kwh']:.1f} kWh.",
            "badge": "BATTERY ENGINE"
        })

    if gen_health["status"] == "DEGRADED":
        alerts.append({
            "id": "alt_gen_deg",
            "type": "critical",
            "title": f"Generator Output Degraded ({gen_health['health_factor']*100:.0f}%)",
            "message": f"Available generator capacity reduced from {gen_rated:.0f} kW to {gen_health['effective_capacity_kw']:.1f} kW. Reason: {'; '.join(gen_health['reasons'])}",
            "badge": "ANOMALY ENGINE"
        })

    if shortfall["status"] != "NORMAL":
        alerts.append({
            "id": "alt_shortfall",
            "type": "critical" if shortfall["status"] == "SHORTFALL RISK" else "warning",
            "title": shortfall["status_label"],
            "message": f"Power deficit expected in {shortfall['expected_in_hours']}. Est. deficit: {shortfall['estimated_deficit_kw']} kW. {shortfall['reasons'][0]}",
            "badge": "AI SHORTFALL ENGINE"
        })

    if preset["offline_mode"]:
        alerts.append({
            "id": "alt_offline",
            "type": "info",
            "title": "Offline-First Local Operation Active",
            "message": "Satellite network connection unavailable. System executing on local edge node with cached weather data.",
            "badge": "OFFLINE SYNC"
        })

    return {
        "station": config,
        "scenario": preset,
        "weather": {
            "temperature_c": round(adjusted_temp, 1),
            "wind_speed_ms": round(adjusted_wind, 1),
            "solar_radiation_wm2": round(adjusted_solar_rad, 1),
            "badge_weather": config["badge_weather"],
            "source": weather["source"]
        },
        "badge_telemetry": config["badge_telemetry"],
        "current_demand_kw": current_demand,
        "current_solar_kw": current_solar,
        "current_wind_kw": current_wind,
        "current_total_supply_kw": total_current_supply,
        "power_headroom_kw": power_headroom,
        "battery_derating": battery,
        "generator_health": gen_health,
        "allocation": allocation,
        "forecasts": forecasts,
        "shortfall_risk": shortfall,
        "alerts": alerts,
        "offline_mode": preset["offline_mode"]
    }
