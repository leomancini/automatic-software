#!/bin/bash

export PATH="$PATH:/home/leo/.local/bin"

cd /home/leo/react-apps/automatic-software

echo "$(date): Starting claude improvement run..."

# Read telemetry data if available
TELEMETRY=""
if [ -f telemetry.json ]; then
  TELEMETRY=$(cat telemetry.json)
fi

if [ -n "$TELEMETRY" ]; then
  TELEMETRY_PROMPT="

Here is usage telemetry from real users showing which features they interact with most:
$TELEMETRY

Use this data to inform your decisions — lean into what people use most, consider removing or reworking what nobody touches, and let popular interactions inspire new directions."
else
  TELEMETRY_PROMPT=""
fi

claude -p "Explore the codebase and evolve the app. You don't have to improve what's already there — feel free to take it in any direction, add something completely new, or even radically reimagine what the app is. The app can slowly (or suddenly) become something totally different over time. Removing features is totally fine and encouraged — it keeps the app lean and sustainable. Don't be afraid to cut things that feel cluttered, redundant, or low-value. Just keep each change to one coherent idea so nothing breaks. All changes should work on both mobile and desktop.${TELEMETRY_PROMPT}

When done, stage all changes and commit with a short conventional commit message, then push." --dangerously-skip-permissions --max-budget-usd 2.00

echo "$(date): Claude finished. Waiting 60 seconds before screenshot..."

sleep 60

echo "$(date): Taking screenshot..."

bash /home/leo/react-apps/automatic-software/take-screenshot.sh

echo "$(date): Done."
