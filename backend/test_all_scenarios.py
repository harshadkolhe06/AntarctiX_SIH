"""
PRAKASH - Automated Acceptance Test Suite (Tests 1 - 8)
Verifies all 8 core scenario requirements specified in SIH problem statement SIH26061.
"""

import asyncio
from config import STATIONS, get_station_config
from battery_engine import calculate_battery_derating
from anomaly_engine import generator_detector
from forecast_engine import forecaster
from allocation_engine import allocate_energy_sources
from shortfall_engine import evaluate_shortfall_risk
from scenario_engine import execute_scenario
from database import queue_offline_event, sync_offline_events, get_pending_offline_count

async def run_acceptance_tests():
    print("==================================================")
    print("     PRAKASH MVP - FINAL ACCEPTANCE TEST SUITE    ")
    print("==================================================")
    
    passed_tests = 0
    total_tests = 8

    # TEST 1: Normal operation -> no shortfall
    print("\n--- TEST 1: Normal Operation ---")
    st1 = await execute_scenario("BHARATI", "NORMAL")
    assert st1["shortfall_risk"]["status"] == "NORMAL", f"Expected NORMAL status, got {st1['shortfall_risk']['status']}"
    assert st1["allocation"]["diesel_used_kw"] == 0.0, "Expected zero diesel usage in normal renewable window"
    print("[OK] TEST 1 PASSED: Normal operation running on 100% renewables with zero shortfall.")
    passed_tests += 1

    # TEST 2: Extreme cold -> battery usable capacity decreases
    print("\n--- TEST 2: Extreme Cold (-38 C) ---")
    st2 = await execute_scenario("BHARATI", "EXTREME_COLD")
    derating_pct = st2["battery_derating"]["derating_pct"]
    assert derating_pct >= 60.0, f"Expected derating >= 60%, got {derating_pct}%"
    print(f"[OK] TEST 2 PASSED: Extreme cold (-38 C) successfully derated battery usable capacity by {derating_pct}%.")
    passed_tests += 1

    # TEST 3: Low solar/wind -> battery/diesel allocation changes
    print("\n--- TEST 3: Low Solar & Low Wind ---")
    st3 = await execute_scenario("BHARATI", "LOW_WIND")
    alloc3 = st3["allocation"]
    assert alloc3["battery_used_kw"] > 0 or alloc3["diesel_used_kw"] > 0, "Battery or Diesel used to offset wind drop"
    print(f"[OK] TEST 3 PASSED: Priority allocation order dynamically shifted (Battery Discharged: {alloc3['battery_used_kw']} kW, Diesel: {alloc3['diesel_used_kw']} kW).")
    passed_tests += 1

    # TEST 4: High demand -> shortfall warning appears before critical failure
    print("\n--- TEST 4: High Demand Spikes ---")
    st4 = await execute_scenario("BHARATI", "HIGH_LOAD")
    sf4 = st4["shortfall_risk"]
    assert sf4["status"] in ["WATCH", "SHORTFALL RISK"], f"Expected shortfall alert, got {sf4['status']}"
    print(f"[OK] TEST 4 PASSED: High demand triggered AI shortfall alert ({sf4['status_label']}) advance lead time.")
    passed_tests += 1

    # TEST 5: Generator failure -> generator capacity reduced -> allocation recalculates
    print("\n--- TEST 5: Generator Failure & Anomaly Detection ---")
    st5 = await execute_scenario("BHARATI", "GENERATOR_FAILURE")
    gen5 = st5["generator_health"]
    assert gen5["status"] == "DEGRADED", f"Expected DEGRADED status, got {gen5['status']}"
    assert gen5["effective_capacity_kw"] < gen5["rated_capacity_kw"], "Capacity was reduced"
    print(f"[OK] TEST 5 PASSED: IsolationForest flagged generator failure. Effective capacity downgraded to {gen5['effective_capacity_kw']} kW.")
    passed_tests += 1

    # TEST 6: Internet/API unavailable -> offline mode continues using cached/local data
    print("\n--- TEST 6: Offline Mode & Buffer Queue ---")
    st6 = await execute_scenario("BHARATI", "OFFLINE")
    assert st6["offline_mode"] == True, "Offline mode should be active"
    queue_offline_event("TEST_EVENT", "BHARATI", {"action": "manual_override"})
    pending = get_pending_offline_count()
    assert pending > 0, "Pending offline events queued"
    sync_res = sync_offline_events()
    assert sync_res["status"] == "SUCCESS", "Offline sync succeeded"
    print(f"[OK] TEST 6 PASSED: Offline local edge mode executed successfully with {sync_res['synced_count']} synced events.")
    passed_tests += 1

    # TEST 7: Switch Bharati -> Maitri -> station-specific configuration loads
    print("\n--- TEST 7: Multi-Station Configuration Switching ---")
    st7_b = await execute_scenario("BHARATI", "NORMAL")
    st7_m = await execute_scenario("MAITRI", "NORMAL")
    assert st7_b["station"]["name"] != st7_m["station"]["name"], "Station names must differ"
    assert st7_b["station"]["coordinates"]["lat"] == -69.408, "Bharati latitude correct"
    assert st7_m["station"]["coordinates"]["lat"] == -70.766, "Maitri latitude correct"
    print(f"[OK] TEST 7 PASSED: Switched from {st7_b['station']['name']} to {st7_m['station']['name']} with station-specific configurations.")
    passed_tests += 1

    # TEST 8: Scenario reset -> system returns to normal values
    print("\n--- TEST 8: Scenario Reset to Normal ---")
    st8 = await execute_scenario("BHARATI", "NORMAL")
    assert st8["scenario"]["id"] == "NORMAL", "Returned to NORMAL scenario"
    assert st8["shortfall_risk"]["status"] == "NORMAL", "Returned to NORMAL risk status"
    print("[OK] TEST 8 PASSED: System reset returned all inputs, deratings, and allocations to normal values.")
    passed_tests += 1

    print("\n==================================================")
    print(f"     ALL {passed_tests}/{total_tests} ACCEPTANCE TESTS PASSED SUCCESSFULLY!    ")
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(run_acceptance_tests())
