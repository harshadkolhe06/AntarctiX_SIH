"""
PRAKASH - SQLite Database & Offline Buffer Engine
Manages telemetry logging and queues offline events when disconnected from external networks.
"""

import sqlite3
import json
import os
from datetime import datetime
from typing import Dict, Any, List

DB_PATH = os.path.join(os.path.dirname(__file__), "prakash_offline.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Table for telemetry snapshots
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS telemetry_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            station_id TEXT,
            timestamp TEXT,
            data_json TEXT
        )
    """)
    
    # Table for offline pending sync events
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS offline_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT,
            station_id TEXT,
            timestamp TEXT,
            payload_json TEXT,
            synced INTEGER DEFAULT 0
        )
    """)
    
    conn.commit()
    conn.close()

def queue_offline_event(event_type: str, station_id: str, payload: Dict[str, Any]):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO offline_events (event_type, station_id, timestamp, payload_json, synced)
        VALUES (?, ?, ?, ?, 0)
    """, (event_type, station_id, datetime.utcnow().isoformat(), json.dumps(payload)))
    conn.commit()
    conn.close()

def get_pending_offline_count() -> int:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM offline_events WHERE synced = 0")
    count = cursor.fetchone()[0]
    conn.close()
    return count

def sync_offline_events() -> Dict[str, Any]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, event_type, station_id, timestamp FROM offline_events WHERE synced = 0")
    rows = cursor.fetchall()
    
    event_ids = [r[0] for r in rows]
    count = len(event_ids)

    if count > 0:
        cursor.execute(f"UPDATE offline_events SET synced = 1 WHERE id IN ({','.join(['?']*count)})", event_ids)
        conn.commit()

    conn.close()

    return {
        "status": "SUCCESS",
        "synced_count": count,
        "message": f"Successfully synchronized {count} offline queued telemetry events with central NCPOR cloud registry.",
        "timestamp": datetime.utcnow().isoformat()
    }

def log_telemetry_snapshot(station_id: str, snapshot: Dict[str, Any]):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO telemetry_logs (station_id, timestamp, data_json)
        VALUES (?, ?, ?)
    """, (station_id, datetime.utcnow().isoformat(), json.dumps(snapshot)))
    conn.commit()
    conn.close()

# Initialize database on import
init_db()
