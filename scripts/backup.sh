#!/bin/bash

# ==============================================================================
# HOSTA MICROSERVICES - AUTOMATIC BACKUP SCRIPT
# ==============================================================================
# This script dumps the Postgres databases and uploads them to S3.
# ==============================================================================

# 1. SETTINGS
BACKUP_DIR="/home/ubuntu/app/backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
S3_BUCKET="hosta-backups-storage" # UPDATE THIS TO YOUR ACTUAL BUCKET
RETENTION_DAYS=7

# 2. CREATE FOLDER
mkdir -p $BACKUP_DIR

echo "Starting backup at $TIMESTAMP..."

# 3. LIST OF SERVICES TO BACKUP
# Add/Remove folder names here
SERVICES=("user-service" "doctor-service" "staff-service" "hospital-service" "booking-service" "notification-service" "ads-service")

for SERVICE in "${SERVICES[@]}"
do
    echo "Processing $SERVICE..."
    
    # Extract DATABASE_URL from the service's .env file
    ENV_FILE="/home/ubuntu/app/.env.$SERVICE"
    if [ -f "$ENV_FILE" ]; then
        DB_URL=$(grep DATABASE_URL "$ENV_FILE" | cut -d'=' -f2-)
        
        if [ ! -z "$DB_URL" ]; then
            FILENAME="$BACKUP_DIR/${SERVICE}_$TIMESTAMP.sql.gz"
            
            # Run pg_dump (using the one inside the app if needed, or host pg_dump)
            pg_dump "$DB_URL" | gzip > "$FILENAME"
            
            echo "Successfully dumped $SERVICE to $FILENAME"
            
            # 4. UPLOAD TO S3 (Requires aws-cli installed and configured)
            # aws s3 cp "$FILENAME" "s3://$S3_BUCKET/$SERVICE/"
        else
            echo "Error: No DATABASE_URL found for $SERVICE"
        fi
    else
        echo "Error: Env file $ENV_FILE not found"
    fi
done

# 5. CLEANUP OLD LOCAL BACKUPS
find $BACKUP_DIR -type f -mtime +$RETENTION_DAYS -delete

echo "Backup process finished!"
