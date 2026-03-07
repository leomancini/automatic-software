#!/bin/bash

export PATH="$PATH:/home/leo/.local/bin"

cd /home/leo/react-apps/automatic-software

echo "$(date): Starting claude improvement run..."

claude -p "Explore the codebase and add one small but meaningful improvement — a new feature, a UI polish, or a refactor. Be creative but conservative in scope. When done, stage all changes and commit with a short conventional commit message that describes what you did, then push." --dangerously-skip-permissions --max-budget-usd 2.00

echo "$(date): Claude finished. Waiting 60 seconds before screenshot..."

sleep 60

echo "$(date): Taking screenshot..."

bash /home/leo/react-apps/automatic-software/take-screenshot.sh

echo "$(date): Done."
