"""
PRAKASH - Cold-Weather Battery Derating Engine
Rule-based derating model based on temperature in polar conditions.
"""

from typing import Dict, Any

def calculate_battery_derating(temp_c: float, nominal_capacity_kwh: float, soc_percent: float) -> Dict[str, Any]:
    """
    Calculates temperature-adjusted usable battery capacity based on Antarctic conditions.
    
    Derating rules:
    - Temp >= 0°C  => 0% derating
    - Temp = -10°C => 15% derating
    - Temp = -20°C => 35% derating
    - Temp < -20°C => Linear conservative derating: 35% + 1.5% per degree below -20°C (capped at 80%)
    """
    if temp_c >= 0.0:
        derating_pct = 0.0
        derating_label = "Nominal operating temperature (>= 0°C)"
    elif temp_c > -10.0:
        # Interpolate between 0°C (0%) and -10°C (15%)
        derating_pct = (abs(temp_c) / 10.0) * 15.0
        derating_label = "Mild cold derating (0°C to -10°C)"
    elif temp_c == -10.0:
        derating_pct = 15.0
        derating_label = "Standard cold derating (-10°C)"
    elif temp_c > -20.0:
        # Interpolate between -10°C (15%) and -20°C (35%)
        fraction = (abs(temp_c) - 10.0) / 10.0
        derating_pct = 15.0 + fraction * 20.0
        derating_label = "Severe cold derating (-10°C to -20°C)"
    elif temp_c == -20.0:
        derating_pct = 35.0
        derating_label = "Extreme cold derating (-20°C)"
    else:
        # Below -20°C: conservative rule (+1.5% per degree below -20)
        extra_degrees = abs(temp_c) - 20.0
        derating_pct = min(80.0, 35.0 + extra_degrees * 1.5)
        derating_label = f"Deep polar freezing derating ({temp_c:.1f}°C, SIMULATED CONSERVATIVE RULE)"

    health_factor = 1.0 - (derating_pct / 100.0)
    derated_capacity_kwh = nominal_capacity_kwh * health_factor
    
    # Effective usable capacity based on current State of Charge (SOC)
    effective_usable_kwh = derated_capacity_kwh * (soc_percent / 100.0)
    
    # Max discharge rate in kW (assume max 0.5C discharge rate for lithium iron phosphate / polar cells)
    max_discharge_kw = min(derated_capacity_kwh * 0.5, effective_usable_kwh)

    return {
        "temperature_c": round(temp_c, 1),
        "nominal_capacity_kwh": round(nominal_capacity_kwh, 1),
        "soc_percent": round(soc_percent, 1),
        "derating_pct": round(derating_pct, 1),
        "health_factor": round(health_factor, 3),
        "derated_capacity_kwh": round(derated_capacity_kwh, 1),
        "effective_usable_capacity_kwh": round(effective_usable_kwh, 1),
        "max_discharge_kw": round(max_discharge_kw, 1),
        "derating_label": derating_label,
        "is_simulated_rule": temp_c < -20.0,
        "explanation": f"At {temp_c:.1f}°C, cold derating is {derating_pct:.1f}%. Nominal {nominal_capacity_kwh:.0f} kWh capacity is reduced to {derated_capacity_kwh:.1f} kWh usable ({effective_usable_kwh:.1f} kWh at {soc_percent:.0f}% SOC)."
    }
