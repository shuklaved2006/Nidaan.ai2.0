"""
Module D: Offline Telemetry & Conflict Resolution Sync Manager
Vector Clock & Last-Write-Wins (LWW) Timestamp Reconciliation Engine
"""
import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify

sync_bp = Blueprint('sync', __name__)

def resolve_lww_conflict(local_record: dict, incoming_record: dict) -> dict:
    """
    Resolves data sync conflict using Last-Write-Wins (LWW) strategy based on ISO timestamps
    and vector clock sequence numbers.
    """
    local_ts = local_record.get("timestamp") or "1970-01-01T00:00:00Z"
    incoming_ts = incoming_record.get("timestamp") or "1970-01-01T00:00:00Z"
    
    local_vclock = local_record.get("vclock", 0)
    incoming_vclock = incoming_record.get("vclock", 0)
    
    # Highest vector clock sequence wins first; fallback to timestamp comparison
    if incoming_vclock > local_vclock:
        winner = incoming_record
    elif local_vclock > incoming_vclock:
        winner = local_record
    elif incoming_ts >= local_ts:
        winner = incoming_record
    else:
        winner = local_record
        
    merged = winner.copy()
    merged["vclock"] = max(local_vclock, incoming_vclock) + 1
    merged["resolved_at"] = datetime.utcnow().isoformat() + "Z"
    return merged


@sync_bp.route('/api/v2/sync/offline-batch', methods=['POST'])
def process_offline_batch():
    """
    Ingests batch of queued offline transactions from IndexedDB/SQLite local store.
    Reconciles conflicts via Vector Clock / LWW and updates central regional state.
    """
    import db_io
    req = request.get_json() or {}
    offline_queue = req.get("queue", [])
    
    data = db_io.get_data()
    processed_count = 0
    resolved_conflicts = 0
    
    for item in offline_queue:
        target_entity = item.get("entity") # e.g. "attendance", "inventory_deduction", "bed_occupancy"
        payload = item.get("payload", {})
        
        if target_entity == "attendance":
            records = data.get("attendance", [])
            existing = next((r for r in records if r.get("staff_id") == payload.get("staff_id") and r.get("date") == payload.get("date")), None)
            if existing:
                resolved = resolve_lww_conflict(existing, payload)
                records.remove(existing)
                records.append(resolved)
                resolved_conflicts += 1
            else:
                payload["vclock"] = 1
                records.append(payload)
            data["attendance"] = records
            processed_count += 1
            
        elif target_entity == "inventory_deduction":
            inventory = data.get("inventory", [])
            item_name = payload.get("item_name")
            deduct_qty = payload.get("qty", 0)
            inv_item = next((i for i in inventory if i.get("name") == item_name), None)
            if inv_item:
                inv_item["quantity"] = max(0, inv_item.get("quantity", 0) - deduct_qty)
                inv_item["vclock"] = inv_item.get("vclock", 0) + 1
                processed_count += 1
                
    db_io.commit_data(data)
    
    return jsonify({
        "status": "BATCH_SYNC_SUCCESS",
        "processed_count": processed_count,
        "resolved_conflicts": resolved_conflicts,
        "synced_at": datetime.utcnow().isoformat() + "Z"
    }), 200
