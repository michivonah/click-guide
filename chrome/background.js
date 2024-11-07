// Background Worker

let steps = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.action){
        case "captureScreenshot":
            chrome.tabs.captureVisibleTab(null, { format: "jpeg" }, (dataUrl) => {
                if (chrome.runtime.lastError) {
                    console.error("Error capturing screenshot: ", chrome.runtime.lastError);
                    sendResponse({ success: false, error: chrome.runtime.lastError });
                    return;
                }
    
                sendResponse({ success: true, screenshot: dataUrl });
            });
            return true;
        case "saveStep":
            try{
                const step = {
                    "label":message.stepLabel,
                    "description":"Short description of the step",
                    "action":message.triggerName,
                    "element":message.stepElement,
                    "image":message.image
                }
                steps.push(step);                
                return sendResponse({ success: true, message: "Step successfully added to guide" });
            }
            catch(error){
                return sendResponse({ success: false, message: error });
            }
        case "generateGuide":
            return sendResponse({ success: true, guide: steps });
        case "clearGuide":
            steps = [];
            return sendResponse({ success: true, message: "Cleared guide successfully" });
        case "guideLenght":
            count = steps.length;
            return sendResponse({ success: true, stepCount: count });
        case "debug":
        default:
            console.log(message.action);
            break;
    }
});