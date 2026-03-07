#!/bin/bash

# Load nvm so node/npm/git are available in non-interactive shells
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

APP_DIR="/home/leo/react-apps/automatic-software"
SCREENSHOTS_DIR="$APP_DIR/screenshots"
FILENAME="$(date '+%Y-%m-%d-%H-%M-%S').png"
SCREENSHOT_PATH="$SCREENSHOTS_DIR/$FILENAME"
URL="https://automatic-software.leo.gd"

mkdir -p "$SCREENSHOTS_DIR"

# Take screenshot (virtual-time-budget gives the page time to render animations)
chromium-browser --headless --no-sandbox --disable-gpu \
  --window-size=1440,1024 --virtual-time-budget=5000 \
  --screenshot="$SCREENSHOT_PATH" \
  "$URL" 2>/dev/null

if [ ! -f "$SCREENSHOT_PATH" ]; then
  echo "Failed to take screenshot"
  exit 1
fi

echo "Screenshot saved to $SCREENSHOT_PATH"

# Commit and push
cd "$APP_DIR" || exit 1
git add screenshots/
git commit -m "Add screenshot $FILENAME"
git remote | while read remote; do
  git push "$remote" main
done

echo "Screenshot committed and pushed"
