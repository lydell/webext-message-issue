// Notice how this is logged before anything in background.js (around 50 ms
// earlier on my machine).
console.log("content.js init", Date.now());

// This message is successfully sent.
browser.runtime.sendMessage("hello from content.js via browser.runtime.sendMessage");

const port = browser.runtime.connect();
// Logs an "No matching message handler for the given recipient." error to the
// browser console.
port.postMessage("hello from content.js via port");
port.onDisconnect.addListener(() => {
  // This is logged to the console before anything in background.js.
  console.log("content.js port.onDisconnect", Date.now());
});
