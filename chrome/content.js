// Script which is executed on all web pages

// Page meta data
const pageTitle = document.title;
const domainFormatted = window.location.host.replace(/\./g, "-");

// set guide title
chrome.storage.local.get("guideTitle", (data) => {
    if(!data.guideTitle || data.guideTitle != pageTitle){
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
                    const pixelPadding = 150;
                    const dpr = window.devicePixelRatio || 1;

                    let parentElement = element.parentNode || element; // element.parentNode.parentNode || 

                    parentElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });

                    const parentRect = parentElement.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;

                    const croppedWidth = (parentRect.width + pixelPadding) * dpr;
                    const croppedHeight = (parentRect.height + pixelPadding) * dpr;

                    const viewportX = Math.max((parentRect.left - pixelPadding / 2) * dpr, 0);
                    const viewportY = Math.max((parentRect.top - pixelPadding / 2) * dpr, 0);

                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    canvas.width = croppedWidth;
                    canvas.height = croppedHeight;
    
                    ctx.drawImage(
                        img,
                        viewportX, viewportY, croppedWidth, croppedHeight,
                        0, 0, croppedWidth, croppedHeight
                    );

                    // calculate coordinates of the clicked element
                    const elementStartX = Math.max((rect.left - (parentRect.left - pixelPadding / 2)), 0);
                    const elementStartY = Math.max((rect.top - (parentRect.top - pixelPadding / 2)), 0);
                    const elementEndX = elementStartX + rect.width;// + (pixelPadding / 2);
                    const elementEndY = elementStartY + rect.height;// + (pixelPadding / 2);
    
                    const croppedDataUrl = canvas.toDataURL("image/jpeg");
                    chrome.runtime.sendMessage({
                        action: "saveStep",
                        image: croppedDataUrl,
                        stepLabel: elementText,
                        stepElement: elementSelector,
                        triggerName: "click",
                        elementPosition: {
                            startX: elementStartX,
                            startY: elementStartY,
                            endX: elementEndX,
                            endY: elementEndY
                        }
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
