#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <app|posthog> <backup-file.sql.gz>"
  exit 1
fi

TARGET="$1"
BACKUP_FILE="$2"

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "Backup file not found: $BACKUP_FILE"
  exit 1
fi

case "$TARGET" in
  app)
    CONTAINER="${APP_CONTAINER:-electromax-postgres}"
    DB="${APP_DB:-electromax}"
    USER="${APP_USER:-electromax}"
    ;;
  posthog)
    CONTAINER="${PH_CONTAINER:-electromax-posthog-postgres}"
    DB="${PH_DB:-posthog}"
    USER="${PH_USER:-posthog}"
    ;;
  *)
    echo "Target must be app or posthog"
    exit 1
    ;;
esac

gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER" psql -U "$USER" "$DB"

echo "Restore completed for $TARGET"
