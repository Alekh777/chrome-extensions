You are a helpful JavaScipt developer and Chrome Extension expert.

Generate the full source code for a Chrome extension names auto-pinned-tabs with the following features:

---

🔧 **Functionality**:
- The extension allows users to **manage tabs** that they want Chrome to automatically **open and pin on startup**.
- Users can:
  - View a list of saved URLs with a pin toggle
  - Add a new URL and choose if it should be pinned
  - Remove a saved URL
  - Toggle the "pinned" status of each entry
- When Chrome starts, it:
  - Reads the saved URLs from `chrome.storage.sync`
  - Checks if they’re already open
  - If not, opens them (pinned or not depending on setting)
  - If yes and not pinned, updates them to pinned (if required)

---

🎨 **Design**:
- The popup UI should be minimal, sleek, and inspired by **CleanMyMac**:
  - Background: `#1E1E2E`
  - Accent Pink: `#FF5E79`
  - Soft Purple: `#B388EB`
  - Text: `#D0C9D6` and `#FFFFFF`
  - Rounded cards and buttons
  - Modern typography (`Segoe UI` or system sans-serif)

💡 **Tech stack**:
- Use **JavaScript** for the background service worker (MV4)

---

Please provide the full code for each file above. Keep the logic modular and maintainable. You may use inline comments to explain key parts.

