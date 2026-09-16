#!/bin/sh
# Restart contract: revive preview on 0.0.0.0:8080 via npm run dev.
set -e
cd /workspace

if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi

npm run dev >/tmp/cbg-dev.log 2>&1 &
i=0
while [ "$i" -lt 20 ]; do
  if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
    exit 0
  fi
  i=$((i + 1))
  sleep 1
done
exit 0
