console.log("background.js init", Date.now());

// This message is successfully received.
browser.runtime.onMessage.addListener(message => {
  console.log("background.js got message via browser.runtime.onMessage:", message, Date.now());
})

// The port never connects.
browser.runtime.onConnect.addListener(port => {
  console.log("background.js connected", Date.now());
  // This message is never received.
  port.onMessage.addListener(message => {
    console.log("background.js got message:", message, Date.now());
  });
});
