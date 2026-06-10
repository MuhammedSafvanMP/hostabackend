#!/bin/bash
set -o pipefail   # Fail if ANY command in a pipe fails (e.g. pg_dump fails → whole pipe fails)
# ==============================================================================
# HOSTA MICROSERVICES - AUTOMATIC BACKUP SCRIPT
# ==============================================================================
# Streams pg_dump directly to S3 (no EC2 disk usage).
# Logs results per service with timestamps.
# Sends summary report at the end.
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. SETTINGS
# ------------------------------------------------------------------------------
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
LOG_DIR="/home/ubuntu/app/backups/logs"
LOG_FILE="$LOG_DIR/backup_$TIMESTAMP.log"
S3_BUCKET="hosta-backups-storage"
LOG_RETENTION_DAYS=30   # keep logs for 30 days
FAILED_SERVICES=()
SUCCESS_SERVICES=()

# ------------------------------------------------------------------------------
# 2. SETUP LOG DIR
# ------------------------------------------------------------------------------
mkdir -p "$LOG_DIR"

# All output (stdout + stderr) goes to log file AND terminal
exec > >(tee -a "$LOG_FILE") 2>&1

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "======================================================"
log " HOSTA BACKUP STARTED"
log "======================================================"

# ------------------------------------------------------------------------------
# 3. SERVICES TO BACKUP
# Add/Remove service names here
# ------------------------------------------------------------------------------
SERVICES=(
    "user-service"
    "doctor-service"
    "staff-service"
    "hospital-service"
    "booking-service"
    "notification-service"
    "ads-service"
    "ambulance-service"
    "blood-bank-service"
    "blood-service"
    "review-service"
    "role-service"
    "speciality-service"
)

# ------------------------------------------------------------------------------
# 4. BACKUP LOOP
# ------------------------------------------------------------------------------
for SERVICE in "${SERVICES[@]}"
do
    log "------------------------------------------------------"
    log "Processing: $SERVICE"

    ENV_FILE="/home/ubuntu/app/.env.$SERVICE"

    # Check env file exists
    if [ ! -f "$ENV_FILE" ]; then
        log "ERROR: Env file not found → $ENV_FILE"
        FAILED_SERVICES+=("$SERVICE (no env file)")
        continue
    fi

    # Extract DATABASE_URL
    DB_URL=$(grep "^DATABASE_URL=" "$ENV_FILE" | cut -d'=' -f2-)

    if [ -z "$DB_URL" ]; then
        log "ERROR: No DATABASE_URL found in $ENV_FILE"
        FAILED_SERVICES+=("$SERVICE (no DATABASE_URL)")
        continue
    fi

    S3_PATH="s3://$S3_BUCKET/$SERVICE/${SERVICE}_$TIMESTAMP.sql.gz"

    log "Streaming dump → $S3_PATH"

    # Stream pg_dump directly to S3 (zero EC2 disk usage)
    if pg_dump "$DB_URL" | gzip | aws s3 cp - "$S3_PATH"; then
        log "SUCCESS: $SERVICE backed up to S3"
        SUCCESS_SERVICES+=("$SERVICE")
    else
        log "ERROR: Backup FAILED for $SERVICE"
        FAILED_SERVICES+=("$SERVICE (pg_dump/S3 error)")
    fi
done

# ------------------------------------------------------------------------------
# 5. CLEANUP OLD LOG FILES (keep last 30 days)
# ------------------------------------------------------------------------------
log "------------------------------------------------------"
log "Cleaning up log files older than $LOG_RETENTION_DAYS days..."
find "$LOG_DIR" -type f -name "*.log" -mtime +$LOG_RETENTION_DAYS -delete

# ------------------------------------------------------------------------------
# 6. SUMMARY REPORT
# ------------------------------------------------------------------------------
log "======================================================"
log " BACKUP SUMMARY"
log "======================================================"
log "Timestamp : $TIMESTAMP"
log "Succeeded : ${#SUCCESS_SERVICES[@]} service(s)"
for s in "${SUCCESS_SERVICES[@]}"; do log "  ✔ $s"; done

log "Failed    : ${#FAILED_SERVICES[@]} service(s)"
for f in "${FAILED_SERVICES[@]}"; do log "  ✘ $f"; done

if [ ${#FAILED_SERVICES[@]} -eq 0 ]; then
    log "STATUS: ALL BACKUPS COMPLETED SUCCESSFULLY ✔"
else
    log "STATUS: BACKUP COMPLETED WITH ${#FAILED_SERVICES[@]} FAILURE(S) ✘"
fi

log "Log saved : $LOG_FILE"
log "======================================================"
log " HOSTA BACKUP FINISHED"
log "======================================================"
