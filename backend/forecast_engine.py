"""
PRAKASH - ML Forecast Engine
Uses scikit-learn RandomForestRegressor to forecast 6-hour power demand and solar/wind generation.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from typing import Dict, Any, List
from config import get_station_config

class EnergyForecaster:
    def __init__(self):
        self.load_model = RandomForestRegressor(n_estimators=50, random_state=42)
        self.solar_model = RandomForestRegressor(n_estimators=50, random_state=42)
        self.wind_model = RandomForestRegressor(n_estimators=50, random_state=42)
        self._is_trained = False
        self._train_models()

    def _generate_synthetic_dataset(self) -> pd.DataFrame:
        """Generates realistic synthetic polar telemetry training dataset (1000 hours)."""
        np.random.seed(42)
        hours = 1000
        
        # Features
        hour_of_day = np.array([i % 24 for i in range(hours)])
        temp_c = -20.0 + 5.0 * np.sin(np.linspace(0, 10 * np.pi, hours)) + np.random.normal(0, 3.0, hours)
        wind_speed_ms = np.maximum(0, 12.0 + 6.0 * np.sin(np.linspace(0, 7 * np.pi, hours)) + np.random.normal(0, 4.0, hours))
        
        # Antarctic solar diurnal cycle
        solar_rad = np.maximum(0, 600.0 * np.sin(np.pi * (hour_of_day - 6) / 12) + np.random.normal(0, 50.0, hours))
        solar_rad[ (hour_of_day < 6) | (hour_of_day > 18) ] = 0.0

        station_is_maitri = np.random.choice([0, 1], size=hours)
        
        # Target load formula
        base_load = np.where(station_is_maitri == 1, 110.0, 140.0)
        thermal_heating_load = np.maximum(0, (-temp_c - 10.0) * 2.2)
        activity_load = 20.0 * np.sin(np.pi * (hour_of_day - 8) / 14)
        activity_load = np.maximum(0, activity_load)
        
        load_kw = base_load + thermal_heating_load + activity_load + np.random.normal(0, 8.0, hours)
        
        # Target solar generation
        solar_kw = np.minimum(100.0, (solar_rad / 600.0) * 95.0 + np.random.normal(0, 3.0, hours))
        solar_kw = np.maximum(0, solar_kw)

        # Target wind generation
        wind_efficiency = np.clip((wind_speed_ms - 3.0) / 11.0, 0, 1)**2.5
        wind_kw = wind_efficiency * 140.0 + np.random.normal(0, 5.0, hours)
        wind_kw = np.maximum(0, wind_kw)

        df = pd.DataFrame({
            "temp_c": temp_c,
            "wind_speed_ms": wind_speed_ms,
            "solar_rad": solar_rad,
            "hour_of_day": hour_of_day,
            "station_is_maitri": station_is_maitri,
            "load_kw": load_kw,
            "solar_kw": solar_kw,
            "wind_kw": wind_kw
        })
        return df

    def _train_models(self):
        df = self._generate_synthetic_dataset()
        X = df[["temp_c", "wind_speed_ms", "solar_rad", "hour_of_day", "station_is_maitri"]]
        
        self.load_model.fit(X, df["load_kw"])
        self.solar_model.fit(X, df["solar_kw"])
        self.wind_model.fit(X, df["wind_kw"])
        self._is_trained = True

    def forecast_6hours(
        self,
        station_id: str,
        current_temp: float,
        current_wind: float,
        current_solar: float,
        scenario_modifier: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        config = get_station_config(station_id)
        station_is_maitri = 1 if station_id.upper() == "MAITRI" else 0
        
        solar_cap_scale = config["nominal_solar_capacity_kw"] / 100.0
        wind_cap_scale = config["nominal_wind_capacity_kw"] / 150.0

        if scenario_modifier is None:
            scenario_modifier = {}

        temp_mult = scenario_modifier.get("temp_offset", 0.0)
        solar_mult = scenario_modifier.get("solar_mult", 1.0)
        wind_mult = scenario_modifier.get("wind_mult", 1.0)
        load_mult = scenario_modifier.get("load_mult", 1.0)

        forecasts = []
        base_hour = 12  # Noon baseline

        # 13 steps of 0.5 hours covering exactly 6 hours (0.0h to 6.0h)
        step_hours = [round(i * 0.5, 1) for i in range(13)]

        for step in step_hours:
            forecast_hour = int((base_hour + step) % 24)
            
            step_temp = current_temp + temp_mult + (-0.5 * step if forecast_hour > 16 else 0.3 * step)
            step_wind = max(0.5, current_wind * wind_mult + (1.2 * np.sin(step) if wind_mult > 0.2 else 0))
            
            solar_diurnal = max(0.0, np.sin(np.pi * (forecast_hour - 6) / 12)) if 6 <= forecast_hour <= 18 else 0.0
            step_solar_rad = current_solar * solar_mult * (0.8 + 0.4 * solar_diurnal)

            X_step = pd.DataFrame([{
                "temp_c": step_temp,
                "wind_speed_ms": step_wind,
                "solar_rad": step_solar_rad,
                "hour_of_day": forecast_hour,
                "station_is_maitri": station_is_maitri
            }])
            
            raw_load = self.load_model.predict(X_step)[0] * load_mult
            raw_solar = self.solar_model.predict(X_step)[0] * solar_cap_scale * solar_mult
            raw_wind = self.wind_model.predict(X_step)[0] * wind_cap_scale * wind_mult

            pred_load = max(30.0, round(float(raw_load), 1))
            pred_solar = max(0.0, round(float(raw_solar), 1))
            pred_wind = max(0.0, round(float(raw_wind), 1))
            pred_renewable = round(pred_solar + pred_wind, 1)
            pred_gap = round(max(0.0, pred_load - pred_renewable), 1)

            forecasts.append({
                "step_hour": step,
                "hour_label": f"+{step}h",
                "predicted_temp_c": round(step_temp, 1),
                "predicted_wind_ms": round(step_wind, 1),
                "predicted_solar_rad": round(step_solar_rad, 1),
                "predicted_load": pred_load,
                "predicted_solar": pred_solar,
                "predicted_wind": pred_wind,
                "predicted_total_renewable": pred_renewable,
                "predicted_gap": pred_gap
            })

        return forecasts

forecaster = EnergyForecaster()
