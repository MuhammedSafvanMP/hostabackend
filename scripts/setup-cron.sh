#!/bin/bash

# ==============================================================================
# HOSTA - BACKUP CRON INSTALLER
# ==============================================================================
# Run this ONCE on the EC2 server to schedule automatic daily backups.
# Usage: bash /home/ubuntu/app/scripts/setup-cron.sh
# ==============================================================================

SCRIPT_PATH="/home/ubuntu/app/scripts/backup.sh"
LOG_PATH="/home/ubuntu/app/backups/cron.log"

# ------------------------------------------------------------------------------
# Pre-flight checks
# ------------------------------------------------------------------------------
echo "Running pre-flight checks..."

# 1. Make backup script executable
chmod +x "$SCRIPT_PATH"
echo "  ✔ Script is executable"

# 2. Check pg_dump
if command -v pg_dump &> /dev/null; then
    echo "  ✔ pg_dump found: $(pg_dump --version)"
else
    echo "  ✘ pg_dump NOT found — install it: sudo apt install postgresql-client -y"
    exit 1
fi

# 3. Check AWS CLI
if command -v aws &> /dev/null; then
    echo "  ✔ AWS CLI found: $(aws --version)"
else
    echo "  ✘ AWS CLI NOT found — install it first"
    exit 1
fi

# ------------------------------------------------------------------------------
# Install cron job
# ------------------------------------------------------------------------------

# The safer cron block with explicit SHELL and PATH
CRON_BLOCK="SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
0 0 * * * /bin/bash $SCRIPT_PATH >> $LOG_PATH 2>&1"

# Check if already installed
if crontab -l 2>/dev/null | grep -qF "$SCRIPT_PATH"; then
    echo ""
    echo "Cron job already exists. No changes made."
    echo "Current crontab:"
    crontab -l
    exit 0
fi

# Install
(crontab -l 2>/dev/null; echo "$CRON_BLOCK") | crontab -

echo ""
echo "======================================================"
echo " CRON JOB INSTALLED SUCCESSFULLY ✔"
echo "======================================================"
echo "Schedule : Every day at 12:00 AM (midnight)"
echo "Script   : $SCRIPT_PATH"
echo "Log      : $LOG_PATH"
echo "======================================================"
echo ""
echo "Verify with : crontab -l"
echo "Check logs  : tail -f $LOG_PATH"
echo "Manual test : bash $SCRIPT_PATH"
