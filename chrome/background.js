// Background Worker

const dateToday = new Date().toISOString().split('T')[0];

let guide = {
    "title":"Guide",
    "description":"",
    "date":dateToday,
    "author":"Me",
};
let steps = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.action){
        case "captureScreenshot":
            try{
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
            catch(error){
                return sendResponse({ success: false, message: error });
            }
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
            try{
                let filename = "guide.json";
                chrome.storage.local.get(["guideTitle", "exportFilename"], (data) => {
                    if(data.guideTitle) guide.title = `Guide: ${data.guideTitle}`;
                    if(data.exportFilename) filename = `guide-${data.exportFilename}.json`;
                    guide.steps = steps;
                    return sendResponse({ success: true, guide: guide, filename: filename });
                });
                return true;
            }
            catch(error){
                return sendResponse({ success: false, message: error });
            }
        case "clearGuide":
            try{
                steps = [];
                return sendResponse({ success: true, message: "Cleared guide successfully" });
            }
            catch(error){
                return sendResponse({ success: false, message: error });
            }
        case "guideLenght":
            try{
                count = steps.length;
                return sendResponse({ success: true, stepCount: count });
            }
            catch(error){
                return sendResponse({ success: false, message: error });
            }
        default:
            console.log(message.action);
            break;
    }
});