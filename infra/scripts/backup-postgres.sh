#!/usr/bin/env bash
set -euo pipefail

TS="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$BACKUP_DIR"

APP_CONTAINER="${APP_CONTAINER:-electromax-postgres}"
APP_DB="${APP_DB:-electromax}"
APP_USER="${APP_USER:-electromax}"

PH_CONTAINER="${PH_CONTAINER:-electromax-posthog-postgres}"
PH_DB="${PH_DB:-posthog}"
PH_USER="${PH_USER:-posthog}"

docker exec "$APP_CONTAINER" pg_dump -U "$APP_USER" "$APP_DB" | gzip > "$BACKUP_DIR/app-$TS.sql.gz"
docker exec "$PH_CONTAINER" pg_dump -U "$PH_USER" "$PH_DB" | gzip > "$BACKUP_DIR/posthog-$TS.sql.gz"

echo "Backups written to $BACKUP_DIR"
