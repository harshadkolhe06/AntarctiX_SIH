"""
PRAKASH - Shortfall Detector Engine
Analyzes 6-hour forecasts to predict power deficits before they threaten station critical loads.
"""

from typing import Dict, Any, List

def evaluate_shortfall_risk(
    forecasts: List[Dict[str, Any]],
    battery_usable_kwh: float,
    effective_diesel_capacity_kw: float,
    critical_load_ratio: float = 0.65
) -> Dict[str, Any]:
    """
    Evaluates upcoming shortfall risks across the 6-hour forecast window.
    """
    shortfall_detected = False
    watch_detected = False
    
    first_shortfall_hour = None
    max_deficit_kw = 0.0
    affected_load_desc = "None"
    reasons: List[str] = []
    actions: List[str] = []

    for item in forecasts:
        step_hour = item["step_hour"]
        pred_load = item["predicted_load"]
        pred_solar = item["predicted_solar"]
        pred_wind = item["predicted_wind"]
        
        critical_demand = pred_load * critical_load_ratio
        non_critical_demand = pred_load - critical_demand
        
        # Max power supply capacity at this step
        total_renewables = pred_solar + pred_wind
        max_hourly_battery_power = min(battery_usable_kwh * 0.5, battery_usable_kwh)
        max_possible_supply = total_renewables + max_hourly_battery_power + effective_diesel_capacity_kw

        # Unserved gap when using ALL available sources including diesel
        deficit = pred_load - max_possible_supply

        if deficit > 0:
            shortfall_detected = True
            if first_shortfall_hour is None:
                first_shortfall_hour = step_hour
            max_deficit_kw = max(max_deficit_kw, deficit)

            if max_possible_supply < critical_demand:
                affected_load_desc = "CRITICAL LIFE-SUPPORT & HEAVY HEATING LOADS AT RISK"
                reasons.append(f"In t+{step_hour}h: Total supply capacity ({max_possible_supply:.1f} kW) falls below critical load threshold ({critical_demand:.1f} kW)")
            else:
                affected_load_desc = "Non-critical research & auxiliary facilities"
                reasons.append(f"In t+{step_hour}h: Deficit of {deficit:.1f} kW exceeds non-critical load threshold")

        elif (pred_load - (total_renewables + max_hourly_battery_power)) > (effective_diesel_capacity_kw * 0.5):
            # Heavy reliance on diesel (>50% generator rated load)
            watch_detected = True
            if first_shortfall_hour is None:
                first_shortfall_hour = step_hour
            reasons.append(f"In t+{step_hour}h: High demand relies heavily on diesel backup genset ({pred_load - total_renewables:.1f} kW diesel required)")

    # Status Determination
    if shortfall_detected:
        status = "SHORTFALL RISK"
        color = "red"
        status_label = "CRITICAL POWER SHORTAGE PREDICTED"
        actions = [
            "Prepare backup diesel generator units for immediate auto-start",
            "Shed non-critical scientific instruments and deep freezer aux pumps",
            "Increase battery storage discharge contribution",
            "Alert Antarctic Station Operations Lead & NCPOR Energy Control"
        ]
    elif watch_detected:
        status = "WATCH"
        color = "amber"
        status_label = "SHORTFALL RISK DETECTED / DIESEL BACKUP ACTIVE"
        actions = [
            "Monitor wind speed trend and battery state-of-charge",
            "Optimize thermal storage and pre-heat living quarters",
            "Verify diesel generator pre-heater status"
        ]
    else:
        status = "NORMAL"
        color = "green"
        status_label = "NO SHORTFALL PREDICTED"
        actions = [
            "Maintain solar and wind priority allocation",
            "Store excess renewable generation in battery reserve",
            "Normal Antarctic research operations ongoing"
        ]

    time_str = f"{first_shortfall_hour * 1.0:.1f} hours" if first_shortfall_hour else "No shortfall predicted in next 6h"

    return {
        "status": status,
        "color": color,
        "status_label": status_label,
        "expected_in_hours": time_str,
        "first_shortfall_step": first_shortfall_hour,
        "estimated_deficit_kw": round(max_deficit_kw, 1),
        "affected_load": affected_load_desc,
        "reasons": reasons if reasons else ["Sufficient renewable and stored energy headroom available across all 6 forecast hours."],
        "recommended_actions": actions,
        "badge": "AI SHORTFALL DETECTOR"
    }
