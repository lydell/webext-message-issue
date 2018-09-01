# Firefox WebExtension message issue

This extension demonstrates an issue with messaging between content and
background scripts in Firefox. The code is essentially the same as the example at:
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/connect#Examples

Instructions:

1. Open https://www.mozilla.org/en-US/ (or any website where WebExtension are allowed to run).
2. Go to about:debugging and load this folder as a temporary addon.
3. Open the Browser console. Note the logs.
4. Open a new tab with https://www.mozilla.org/en-US/ (or any website where WebExtension are allowed to run).
5. Note the logs in the Browser console again.

Actual logs (notice the errors and missing messages):

```
# At startup:
content.js init 1535806526557 content.js:3:1
No matching message handler for the given recipient. MessageChannel.jsm:924
content.js port.onDisconnect 1535806526629 content.js:14:3
Error: Could not establish connection. Receiving end does not exist. content.js:6:1
background.js init 1535806526637 background.js:1:1

# When new tab is opened:
content.js init 1535806535428 content.js:3:1
background.js got message via browser.runtime.onMessage hello from content.js via browser.runtime.sendMessage 1535806535503 background.js:5:3
background.js connected 1535806535512 background.js:10:3
background.js got message hello from content.js via port 1535806535513 background.js:13:5 
```

Expected logs (all messages go through as expected):

```
# At startup:
content.js init 1535806526557 content.js:3:1
background.js init 1535806526637 background.js:1:1
background.js got message via browser.runtime.onMessage hello from content.js via browser.runtime.sendMessage 1535806535503 background.js:5:3
background.js connected 1535806535512 background.js:10:3
background.js got message hello from content.js via port 1535806535513 background.js:13:5 

# When new tab is opened:
content.js init 1535806535428 content.js:3:1
background.js got message via browser.runtime.onMessage hello from content.js via browser.runtime.sendMessage 1535806535503 background.js:5:3
background.js connected 1535806535512 background.js:10:3
background.js got message hello from content.js via port 1535806535513 background.js:13:5 
```

(Whether “content.js init” or “background.js init” is logged first doesn’t matter to me as long as the messaging works.)

The thing here is that there are essentially two types of tabs:

- Those opened _before_ background.js is run,
- and those opened _after_ background.js is run.

Tabs can exist before background.js is run in a number of ways:

- All open tabs when the addon is installed, enabled, updated or reloaded.
  (Chrome doesn’t run content scripts at all in these cases – only for new tabs.)
- Initial tabs when Firefox starts. (Chrome runs the content scripts _after_
  background in this case.)

Content scripts for tabs opened before the extension was started run _before_
background.js. But content scripts for all tabs opened after that naturally run
_after_ background.js. This makes it very difficult to set up messaging between
content and background scripts in a reliable way.

The source code is annotated with comments saying what happens in the case where
content.js is run _before_ background.js.

Tested with: Firefox Nightly 63.0a1 (2018-09-01) (64-bit)

https://bugzilla.mozilla.org/show_bug.cgi?id=1369841
