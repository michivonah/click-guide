// Custom branding
//document.body.style.setProperty('--primary', '#3498db');
//document.getElementById("logo").src = "https://michivonah.ch/assets/logo/logo_white.svg";

// Print Button
const printBtn = document.getElementById("printBtn");
printBtn.addEventListener('click', function(){
    window.print();
});

// Import guide
const importBtn = document.getElementById("importBtn");
const fileInput = document.getElementById("file-import-input");
importBtn.addEventListener('click', function(){
    fileInput.click();
});

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event){
        const content = event.target.result;
        const data = JSON.parse(content);
        loadGuide(data);
    };
    reader.readAsText(file);
});

// export guide button
const exportBtn = document.getElementById("exportBtn");
exportBtn.addEventListener('click', function(){
    exportGuide();
});

// share guide button
const shareBtn = document.getElementById("shareBtn");
shareBtn.addEventListener('click', function(){
    alert("Coming soon...");
});


// add step button
const addStepBtn = document.getElementById("addStepBtn");
addStepBtn.addEventListener('click', function(){
    const stepsContainer = document.getElementById("stepsContainer");
    stepsContainer.append(createStepElement("Title", "Description", "../logo/mockup-viewer-editor.jpg", "note", ""));
});

// toggle between editor and viewer mode
function toggleMode(type = "toggle"){
    const bodyClass = document.body.classList;
    switch(type){
        case "viewer":
            // sets mode to viewer
            if (!bodyClass.contains("viewer")) bodyClass.add("viewer");
            break;
        case "editor":
            // sets mode to editor
            if (bodyClass.contains("viewer")) bodyClass.remove("viewer");
            break;
        case "toggle":
        default:
            // toggles between the modes
            if (bodyClass.contains("viewer")){
                bodyClass.remove("viewer");
            }
            else{
                bodyClass.add("viewer");
            }
            break;
    }
    updateContenteditability();
}

function updateContenteditability(){
    const viewerModeActive = document.body.classList.contains("viewer");
    const editableSteps = document.getElementById("stepsContainer").children;

    for (const step of editableSteps){
        const editableChildren = step.querySelectorAll("[contenteditable]");
        for (const child of editableChildren){
            child.contentEditable = viewerModeActive ? "false" : "plaintext-only";
        }
    }    
}

// render guide with steps
function loadGuide(data){
    // render meta data
    const guideTitle = document.getElementById("guideTitle");
    const guideDescription = document.getElementById("guideDescription");
    const guideAuthor = document.getElementById("guideAuthor");

    guideTitle.textContent = data.title;
    guideDescription.textContent = data.description;
    guideAuthor.textContent = data.author;

    // render steps
    const steps =  data.steps;
    const stepsContainer = document.getElementById("stepsContainer");

    for (const step of steps){
        const element = createStepElement(step.label, step.description, step.image, step.action, step.element);
        stepsContainer.append(element);
    }
}

function createStepElement(label, description, imgSrc, triggerAction, triggerElement){
    // create container
    const container = document.createElement("div");
    container.classList = "step";

    // add attributes
    container.dataset.triggerAction = triggerAction;
    container.dataset.triggerElement = triggerElement;

    // create container for text & image
    const textContainer = document.createElement("div");
    const imgContainer = document.createElement("div");

    // create title
    const title = document.createElement("h2");
    title.textContent = label;
    title.contentEditable = "plaintext-only";
    textContainer.appendChild(title);

    // create description
    const desc = document.createElement("p");
    desc.textContent = description;
    desc.contentEditable = "plaintext-only";
    textContainer.appendChild(desc);

    // create image
    const image = document.createElement("img");
    image.src = imgSrc;
    imgContainer.appendChild(image);

    // append to main container
    container.appendChild(textContainer);
    container.appendChild(imgContainer);

    // return step element
    return container;
}

// export guide
function exportGuide(){
    // get metadata
    const guideTitle = document.getElementById("guideTitle");
    const guideDescription = document.getElementById("guideDescription");
    const guideAuthor = document.getElementById("guideAuthor");

    // generate file structure
    const dateToday = new Date().toISOString().split('T')[0];
    let guide = {
        "title":guideTitle.textContent,
        "description":guideDescription.textContent,
        "date":dateToday,
        "author":guideAuthor.textContent,
    };
    let guideSteps = [];

    // add steps to array
    const steps = document.getElementsByClassName("step");
    for (const step of steps){
        const stepObject = {
            "label":step.querySelector("h2").textContent,
            "description":step.querySelector("p").textContent,
            "action":step.dataset.triggerAction,
            "element":step.dataset.triggerElement,
            "image":step.querySelector("img").src
        }
        guideSteps.push(stepObject);
    }

    // add steps to guide object
    guide.steps = guideSteps;

    // export guide
    exportJSON(guide, "guide.json");
}

// export json file
function exportJSON(object, filename){
    try{
        const json = JSON.stringify(object, null, 2);

        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
    
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
    
        URL.revokeObjectURL(url);
    }
    catch(error){
        return error
    }
}