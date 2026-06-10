#!/bin/bash
NEW_JWT="7b7d6b231a0957f9e651f238d95246de350d085936ad6229517ae01fb8935370bc0d4e9e91fe2de456bc6fb818b8e59874cf31f03d7870e23ddc67da85aff8a0"

echo "Updating JWT_SECRET on all env files..."
for f in /home/ubuntu/app/.env.*; do
    if grep -q "^JWT_SECRET=" "$f"; then
        sed -i "s|^JWT_SECRET=.*|JWT_SECRET=$NEW_JWT|" "$f"
        echo "  ✔ Updated $f"
    fi
done
echo "Done! Restarting all containers..."
cd /home/ubuntu/app
docker compose -f docker-compose.prod.yml up -d
echo "All containers restarted with new JWT secret."
