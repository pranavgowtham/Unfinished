#!/usr/bin/env bash
# ==========================================================================
# UNFINISHED — 1-Click Launch Script
# Starts a local static web server via built-in macOS Ruby WEBrick & opens browser
# ==========================================================================

PORT=3000
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting Unfinished server at http://localhost:$PORT..."
echo "Directory: $DIR"

# Check if port 3000 is occupied, if so use 3001
lsof -i :$PORT >/dev/null 2>&1
if [ $? -eq 0 ]; then
  PORT=3001
fi

# Open browser
(sleep 1 && open "http://localhost:$PORT") &

# Start built-in WEBrick server
/usr/bin/ruby -run -ehttpd "$DIR" -p$PORT
