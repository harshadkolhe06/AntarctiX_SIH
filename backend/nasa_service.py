"""
PRAKASH - NASA POWER API Integration & Weather Service
Fetches real public solar, wind, and temperature data from NASA POWER API.
Falls back to cached local weather profile when offline or on timeout.
"""

import httpx
from datetime import datetime, timedelta
from typing import Dict, Any
from config import get_station_config

WEATHER_CACHE: Dict[str, Dict[str, Any]] = {}

async def fetch_weather_data(station_id: str, is_offline_mode: bool = False) -> Dict[str, Any]:
    """
    Fetches real public weather data from NASA POWER API for Bharati/Maitri coordinates.
    If offline mode is enabled or API call times out, returns cached/simulated weather with explicit label.
    """
    config = get_station_config(station_id)
    lat = config["coordinates"]["lat"]
    lon = config["coordinates"]["lon"]
    station_key = station_id.upper()

    if is_offline_mode:
        return _get_cached_weather(station_id, "OFFLINE MODE - LOCAL WEATHER CACHE")

    # If cached recently, return cached weather for speed
    if station_key in WEATHER_CACHE:
        return WEATHER_CACHE[station_key]

    # Try live NASA POWER API call with 1.5s timeout
    try:
        end_date = datetime.utcnow().strftime("%Y%m%d")
        start_date = (datetime.utcnow() - timedelta(days=2)).strftime("%Y%m%d")
        
        url = (
            f"https://power.larc.nasa.gov/api/temporal/hourly/point"
            f"?parameters=ALLSKY_SFC_SW_DWN,WS10M,T2M"
            f"&community=RE&longitude={lon}&latitude={lat}&format=JSON"
            f"&start={start_date}&end={end_date}"
        )
        
        async with httpx.AsyncClient(timeout=1.5) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                properties = data.get("properties", {}).get("parameter", {})
                
                t2m = properties.get("T2M", {})
                ws10m = properties.get("WS10M", {})
                sw_dwn = properties.get("ALLSKY_SFC_SW_DWN", {})

                latest_temp = list(t2m.values())[-1] if t2m else config["default_temp_c"]
                latest_wind = list(ws10m.values())[-1] if ws10m else config["default_wind_speed_ms"]
                latest_solar = list(sw_dwn.values())[-1] if sw_dwn else config["default_solar_radiation"]

                if latest_temp < -80 or latest_temp > 40:
                    latest_temp = config["default_temp_c"]
                if latest_wind < 0 or latest_wind > 100:
                    latest_wind = config["default_wind_speed_ms"]
                if latest_solar < 0:
                    latest_solar = config["default_solar_radiation"]

                result = {
                    "station_id": station_id,
                    "temperature_c": round(float(latest_temp), 1),
                    "wind_speed_ms": round(float(latest_wind), 1),
                    "solar_radiation_wm2": round(float(latest_solar), 1),
                    "is_live_nasa_data": True,
                    "badge_weather": "NASA/PUBLIC WEATHER DATA (LIVE API)",
                    "source": "NASA POWER API (LARC)",
                    "timestamp": datetime.utcnow().isoformat()
                }
                WEATHER_CACHE[station_key] = result
                return result

    except Exception:
        pass

    return _get_cached_weather(station_id, "NASA/PUBLIC WEATHER DATA (CACHED LOCAL)")

def _get_cached_weather(station_id: str, badge_note: str) -> Dict[str, Any]:
    config = get_station_config(station_id)
    station_key = station_id.upper()
    
    if station_key in WEATHER_CACHE:
        cached = WEATHER_CACHE[station_key].copy()
        cached["is_live_nasa_data"] = False
        cached["badge_weather"] = badge_note
        return cached

    res = {
        "station_id": station_id,
        "temperature_c": config["default_temp_c"],
        "wind_speed_ms": config["default_wind_speed_ms"],
        "solar_radiation_wm2": config["default_solar_radiation"],
        "is_live_nasa_data": False,
        "badge_weather": badge_note,
        "source": "NASA POWER Antarctic Baseline Climatology",
        "timestamp": datetime.utcnow().isoformat()
    }
    WEATHER_CACHE[station_key] = res
    return res
