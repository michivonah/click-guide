// Background Worker

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message.action);
    if (message.action == "captureScreenshot"){
        chrome.tabs.captureVisibleTab(null, { format: "jpeg" }, (dataUrl) => {
            if (chrome.runtime.lastError) {
                console.error("Error capturing screenshot: ", chrome.runtime.lastError);
                sendResponse({ success: false, error: chrome.runtime.lastError });
                return;
            }
            
            sendResponse({ success: true, screenshot: dataUrl });
        });
        return true;
    }
    /*chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        files: ['test.js']
    });*/
});