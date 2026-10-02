"""
PRAKASH - Smart Energy Allocation Engine
Strict priority-based deterministic allocation: Solar (1) → Wind (2) → Battery (3) → Diesel (4).
Enforces critical load protection and generates transparent decision reasoning.
"""

from typing import Dict, Any, List

def allocate_energy_sources(
    demand_kw: float,
    solar_avail_kw: float,
    wind_avail_kw: float,
    battery_usable_kwh: float,
    diesel_rated_capacity_kw: float,
    generator_health_factor: float,
    critical_load_ratio: float = 0.65
) -> Dict[str, Any]:
    """
    Executes priority energy allocation logic:
    Solar -> Wind -> Battery -> Diesel.
    """
    critical_demand_kw = round(demand_kw * critical_load_ratio, 1)
    non_critical_demand_kw = round(demand_kw - critical_demand_kw, 1)
    
    # Calculate effective diesel generator capacity after health factor downgrade
    effective_diesel_cap_kw = round(diesel_rated_capacity_kw * generator_health_factor, 1)
    
    # Max hourly battery discharge rate (capped at C-rate 0.5 or total usable kWh)
    max_battery_power_kw = round(min(battery_usable_kwh * 0.5, battery_usable_kwh), 1)

    steps: List[str] = []

    # Priority 1: Solar
    solar_used = min(demand_kw, solar_avail_kw)
    rem_demand = demand_kw - solar_used
    if solar_used > 0:
        steps.append(f"Solar allocated: {solar_used:.1f} kW")
    else:
        steps.append("Solar unavailable (0 kW)")

    # Priority 2: Wind
    wind_used = min(rem_demand, wind_avail_kw)
    rem_demand -= wind_used
    if wind_used > 0:
        steps.append(f"Wind allocated: {wind_used:.1f} kW")
    else:
        steps.append("Wind insufficient/unavailable")

    # Priority 3: Battery Storage
    battery_used = min(rem_demand, max_battery_power_kw)
    rem_demand -= battery_used
    if battery_used > 0:
        steps.append(f"Battery storage discharged: {battery_used:.1f} kW (Usable reserve: {battery_usable_kwh:.1f} kWh)")
    else:
        steps.append("Battery buffer not required or depleted")

    # Priority 4: Diesel Generator (Last Resort)
    diesel_used = min(rem_demand, effective_diesel_cap_kw)
    rem_demand -= diesel_used
    if diesel_used > 0:
        steps.append(f"Diesel generator dispatched (LAST RESORT): {diesel_used:.1f} kW (Capacity: {effective_diesel_cap_kw:.1f} kW)")
    else:
        steps.append("Diesel generator NOT REQUIRED (Zero carbon operational window)")

    # Evaluate unserved shortfall and critical load status
    remaining_unserved_gap = round(max(0.0, rem_demand), 1)
    total_supplied_kw = round(solar_used + wind_used + battery_used + diesel_used, 1)

    critical_load_met = total_supplied_kw >= critical_demand_kw
    
    if remaining_unserved_gap > 0:
        non_critical_shed_kw = min(non_critical_demand_kw, remaining_unserved_gap)
        if not critical_load_met:
            steps.append(f"CRITICAL WARNING: System shortfall of {remaining_unserved_gap:.1f} kW threatens critical life-support loads!")
        else:
            steps.append(f"Load shedding active: {non_critical_shed_kw:.1f} kW non-critical load shed to preserve critical facilities.")
    else:
        non_critical_shed_kw = 0.0

    # Fuel consumption & KPIs
    # Standard polar marine diesel genset fuel rate ≈ 0.26 L / kWh
    fuel_consumption_lph = round(diesel_used * 0.26, 2)
    
    renewable_gen = solar_used + wind_used
    renewable_share_pct = round((renewable_gen / total_supplied_kw * 100.0), 1) if total_supplied_kw > 0 else 0.0

    # Human-readable flow reason
    decision_reason = " → ".join(steps)

    return {
        "demand_kw": round(demand_kw, 1),
        "critical_demand_kw": critical_demand_kw,
        "non_critical_demand_kw": non_critical_demand_kw,
        "solar_used_kw": round(solar_used, 1),
        "wind_used_kw": round(wind_used, 1),
        "battery_used_kw": round(battery_used, 1),
        "diesel_used_kw": round(diesel_used, 1),
        "total_supplied_kw": total_supplied_kw,
        "remaining_unserved_gap_kw": remaining_unserved_gap,
        "non_critical_shed_kw": non_critical_shed_kw,
        "critical_load_met": critical_load_met,
        "renewable_share_pct": renewable_share_pct,
        "fuel_consumption_lph": fuel_consumption_lph,
        "effective_diesel_capacity_kw": effective_diesel_cap_kw,
        "decision_reason": decision_reason,
        "priority_order": ["Solar", "Wind", "Battery", "Diesel"],
        "recommended_primary_source": "Solar" if solar_used > 0 else ("Wind" if wind_used > 0 else ("Battery" if battery_used > 0 else "Diesel"))
    }
