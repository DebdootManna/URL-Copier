# URL Copier Chrome Extension

A lightweight Chrome extension that copies the current tab's URL to the clipboard with a keyboard shortcut, similar to the Arc browser's URL copying feature.

## Features

- Copy the current tab's URL to clipboard with a keyboard shortcut
- Works across all websites
- Shows a brief notification when URL is copied
- No UI elements - works silently in the background
- Cross-platform support (Windows/Linux/macOS)

## Keyboard Shortcuts

- Primary: `Ctrl+Shift+C` (Windows/Linux) or `Command+Shift+C` (macOS)
  - Note: This may conflict with Chrome's DevTools element inspector shortcut
- Alternative: `Ctrl+Shift+X` (Windows/Linux) or `Command+Shift+X` (macOS)
  - Recommended for reliable operation

## Installation

### From Source (Developer Mode)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked" button
5. Select the folder containing the extension files
6. The extension is now installed and ready to use

### Changing Keyboard Shortcuts (Optional)

1. Go to `chrome://extensions/shortcuts`
2. Find "URL Copier" extension
3. Click the pencil icon next to the shortcut you want to modify
4. Press your preferred key combination
5. Click "OK"

## How It Works

This extension uses Chrome's extension APIs to:
1. Listen for keyboard shortcuts
2. Get the URL of the current active tab
3. Copy that URL to the clipboard
4. Show a brief notification confirming the action

## Technical Details

- Built with Manifest V3
- Uses modern Clipboard API with fallback to execCommand
- Employs content script injection for clipboard access
- Minimal permissions required:
  - `activeTab`: To access the current tab's URL
  - `clipboardWrite`: For clipboard access
  - `scripting`: To execute content scripts

## File Structure

- `manifest.json`: Extension configuration file
- `background.js`: Service worker that handles commands and logic
- `icon16.png`, `icon48.png`, `icon128.png`: Extension icons

## Troubleshooting

- **Primary shortcut doesn't work**: Chrome's DevTools shortcut takes precedence. Use the alternative shortcut (`Ctrl/Command+Shift+X`) instead.
- **No notification appears**: Some websites may restrict content script execution. Try on different sites.
- **URL not copied**: Make sure the page is fully loaded before using the shortcut.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

MIT License - See LICENSE file for details