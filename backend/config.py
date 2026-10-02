"""
PRAKASH - Station Configurations for Bharati and Maitri (Antarctica)
SIH Problem Statement: SIH26061
"""

from typing import Dict, Any

STATIONS: Dict[str, Dict[str, Any]] = {
    "BHARATI": {
        "id": "BHARATI",
        "name": "Bharati Research Station",
        "location": "Larsemann Hills, East Antarctica",
        "coordinates": {"lat": -69.408, "lon": 76.195},
        "nominal_solar_capacity_kw": 100.0,
        "nominal_wind_capacity_kw": 150.0,
        "nominal_battery_capacity_kwh": 300.0,
        "diesel_generator_rated_kw": 250.0,  # 2x 125 kW generators
        "diesel_fuel_reserve_l": 50000.0,
        "baseline_demand_kw": 140.0,
        "critical_load_ratio": 0.65,  # 65% is critical (life support, heating, comms)
        "default_temp_c": -18.0,
        "default_wind_speed_ms": 12.5,
        "default_solar_radiation": 450.0,  # W/m2
        "min_temp_c": -40.0,
        "max_temp_c": 2.0,
        "badge_telemetry": "SIMULATED STATION TELEMETRY",
        "badge_weather": "NASA/PUBLIC WEATHER DATA",
        "description": "Third Indian Antarctic research station, commissioned in 2012. Highly automated with energy intensive HVAC & environmental support."
    },
    "MAITRI": {
        "id": "MAITRI",
        "name": "Maitri Research Station",
        "location": "Schirmacher Oasis, East Antarctica",
        "coordinates": {"lat": -70.766, "lon": 11.733},
        "nominal_solar_capacity_kw": 60.0,
        "nominal_wind_capacity_kw": 120.0,
        "nominal_battery_capacity_kwh": 200.0,
        "diesel_generator_rated_kw": 200.0,  # 2x 100 kW generators
        "diesel_fuel_reserve_l": 40000.0,
        "baseline_demand_kw": 110.0,
        "critical_load_ratio": 0.70,  # 70% is critical
        "default_temp_c": -22.0,
        "default_wind_speed_ms": 14.2,
        "default_solar_radiation": 380.0,  # W/m2
        "min_temp_c": -45.0,
        "max_temp_c": 0.0,
        "badge_telemetry": "SIMULATED STATION TELEMETRY",
        "badge_weather": "NASA/PUBLIC WEATHER DATA",
        "description": "Second Indian Antarctic research station, established in 1989. Features ice-melt plants, lab facilities, and heavy winter thermal loads."
    }
}

def get_station_config(station_id: str) -> Dict[str, Any]:
    station_key = station_id.upper()
    if station_key not in STATIONS:
        return STATIONS["BHARATI"]
    return STATIONS[station_key]
