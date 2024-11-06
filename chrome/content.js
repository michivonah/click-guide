// Script which is executed on all web pages

//document.body.style.background = "blue";
document.body.style.border = "red 20px solid"; // just to identify if the extension is active on this tab

document.addEventListener('click', function(){
    const element = event.target;
    const elementText = element.textContent; // gets the text of the clicked element
    const elementSelector = element.id; // the id of the clicked element, if exists (else its empty)
    //console.log(elementText + ";" + elementSelector);

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
                console.log(croppedDataUrl);
            };
        } else {
            console.error("Error, while capturing the screenshot:", response.error);
        }
    });
});
