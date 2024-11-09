// Script which is executed on all web pages

// Page meta data
const pageTitle = document.title;
const domainFormatted = window.location.host.replace(/\./g, "-");

// set guide title
chrome.storage.local.get("guideTitle", (data) => {
    if(!data.guideTitle){
        try{
            chrome.storage.local.set({ guideTitle: pageTitle });
            chrome.storage.local.set({ exportFilename: domainFormatted });
        }
        catch(error){
            console.error(`Error while saving guide metadata: ${error}`)
        }
    }
});

// load recording status & react to updates
let isRecording = false;
chrome.storage.local.get("recording", (data) => {
    isRecording = data.recording || false;
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.recording) {
        isRecording = changes.recording.newValue;
    }
    // signalize recording status
    document.body.style.border = isRecording ? "red 20px solid" : "none";
});

// add recording functionality on click
document.addEventListener('click', function(){
    if(isRecording){
        const element = event.target;
        const elementText = element.textContent; // gets the text of the clicked element
        const elementSelector = element.id; // the id of the clicked element, if exists (else its empty)
    
        const rect = element.getBoundingClientRect(); // create a rectangle from the element
    
        chrome.runtime.sendMessage({action: "captureScreenshot"}, (response) => {
            if (response && response.success) {
                const img = new Image();
                img.src = response.screenshot;
                img.onload = () => {
                    const pixelZoom = 350;
    
                    const canvas = document.createElement("canvas");
                    canvas.width = rect.width + pixelZoom;
                    canvas.height = rect.height + pixelZoom;
                    const ctx = canvas.getContext("2d");
    
                    ctx.drawImage(
                        img,
                        rect.left, rect.top, rect.width + pixelZoom, rect.height + pixelZoom, // source size
                        0, 0, rect.width + pixelZoom, rect.height + pixelZoom // result size
                    );
    
                    const croppedDataUrl = canvas.toDataURL("image/jpeg");
                    chrome.runtime.sendMessage({
                        action: "saveStep",
                        image: croppedDataUrl,
                        stepLabel: elementText,
                        stepElement: elementSelector,
                        triggerName: "click"
                    }, (response) => {
                        console.log(response);
                    });
                };
            } else {
                console.error("Error, while capturing the screenshot:", response.error);
            }
        });
    }
});
