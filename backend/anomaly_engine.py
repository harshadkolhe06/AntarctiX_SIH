"""
PRAKASH - Generator Anomaly Detection Engine
Uses scikit-learn IsolationForest to monitor simulated generator telemetry and evaluate generator degradation.
"""

import numpy as np
from sklearn.ensemble import IsolationForest
from typing import Dict, Any, List

class GeneratorAnomalyDetector:
    def __init__(self):
        # Features: [power_kw, load_factor, engine_temp_c, runtime_hours, fuel_consumption_lph]
        self.model = IsolationForest(contamination=0.15, random_state=42)
        self._fit_baseline_model()

    def _fit_baseline_model(self):
        # Synthetic baseline dataset of normal polar station diesel generator operations
        np.random.seed(42)
        n_samples = 300
        
        power_kw = np.random.uniform(50, 200, n_samples)
        load_factor = power_kw / 250.0
        engine_temp_c = 75.0 + 15.0 * load_factor + np.random.normal(0, 2.0, n_samples)  # 75 - 90°C is normal
        runtime_hours = np.random.uniform(10, 500, n_samples)
        fuel_consumption_lph = power_kw * 0.26 + np.random.normal(0, 1.0, n_samples)

        X_normal = np.column_stack([power_kw, load_factor, engine_temp_c, runtime_hours, fuel_consumption_lph])
        self.model.fit(X_normal)

    def evaluate_generator(
        self,
        power_kw: float,
        rated_capacity_kw: float,
        engine_temp_c: float,
        runtime_hours: float,
        fuel_consumption_lph: float,
        is_manual_failure: bool = False
    ) -> Dict[str, Any]:
        """
        Evaluates generator health factor and status.
        """
        load_factor = min(1.0, max(0.0, power_kw / max(1.0, rated_capacity_kw)))
        sample = np.array([[power_kw, load_factor, engine_temp_c, runtime_hours, fuel_consumption_lph]])
        
        # Predict: 1 for normal, -1 for anomaly
        prediction = self.model.predict(sample)[0]
        score = float(self.model.score_samples(sample)[0])  # Negative score; lower means more anomalous

        # Determine health factor & status
        reasons: List[str] = []
        
        if is_manual_failure:
            status = "DEGRADED"
            health_factor = 0.40  # 60% degradation due to mechanical fault
            reasons.append("Manual failure trigger: Generator unit #1 tripped due to fuel injector fault")
        elif engine_temp_c > 100.0 or prediction == -1 or score < -0.60:
            status = "DEGRADED"
            # Calculate health factor based on temperature excess and anomaly severity
            temp_penalty = max(0.0, (engine_temp_c - 88.0) * 0.015)
            anomaly_penalty = max(0.15, abs(score) * 0.35)
            health_factor = max(0.35, round(1.0 - temp_penalty - anomaly_penalty, 2))
            
            if engine_temp_c > 95.0:
                reasons.append(f"Engine temperature elevated ({engine_temp_c:.1f}°C > 88°C norm)")
            if score < -0.55:
                reasons.append(f"IsolationForest anomaly score {score:.3f} indicates erratic fuel/load profile")
        else:
            status = "HEALTHY"
            health_factor = 1.0
            reasons.append("Generator operating within nominal thermodynamic and electrical thresholds")

        effective_capacity_kw = round(rated_capacity_kw * health_factor, 1)

        return {
            "status": status,
            "health_factor": health_factor,
            "rated_capacity_kw": rated_capacity_kw,
            "effective_capacity_kw": effective_capacity_kw,
            "engine_temp_c": round(engine_temp_c, 1),
            "load_factor": round(load_factor, 2),
            "anomaly_score": round(score, 3),
            "reasons": reasons,
            "explanation": f"Generator rated at {rated_capacity_kw:.0f} kW is {status} (Health factor: {health_factor*100:.0f}%). Effective available output: {effective_capacity_kw:.1f} kW. " + "; ".join(reasons),
            "badge": "SIMULATED GENERATOR TELEMETRY"
        }

# Global singleton instance
generator_detector = GeneratorAnomalyDetector()
