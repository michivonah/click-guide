// Background Worker

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message.action);
    /*chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        files: ['test.js']
    });*/
});