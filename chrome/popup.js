// Script for Popup

// load recording status
let isRecording = false;
chrome.storage.local.get("recording", (data) => {
    isRecording = data.recording || false;
    console.log(data);
    updateRecordingLabel(isRecording);
});

// define buttons
const toggleRecordingBtn = document.getElementById("toggleRecording");
const exportBtn = document.getElementById("exportBtn");

toggleRecordingBtn.addEventListener('click', () => {
    //if(isRecording) chrome.runtime.sendMessage({action: "clearGuide"});
    isRecording = !isRecording; // toggle status
    updateRecordingLabel(isRecording); // update label
    chrome.storage.local.set({ recording: isRecording }); // save status
});

exportBtn.addEventListener('click', () => {
    console.log("Export requested");
    chrome.runtime.sendMessage({
        action: "generateGuide"
    }, (response) => {
        const guide = response.guide;
        exportJSON(guide, "guide.json");
    });
});

// update button label
function updateRecordingLabel(bool){
    let startLabel = "Start recording";
    
    try{
        chrome.runtime.sendMessage({
            action: "guideLenght"
        }, (response) => {
            if(response.stepCount !== 0) startLabel = "Resume";
            toggleRecordingBtn.textContent = bool ? "Pause / Stop" : startLabel;
        });
    }
    catch(error){
        console.error(`Error while updating recording button label: ${error}`);
    }
}

// export guide as json
function exportJSON(object, filename){
    const json = JSON.stringify(object, null, 2);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);

    // clear guide
    chrome.runtime.sendMessage({action: "clearGuide"});
}
