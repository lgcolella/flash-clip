
var siteNotes = {};



function getHostname(){
    
    browser.tabs.executeScript({
      file: "get-data.js"
    });
    
    browser.runtime.onMessage.addListener(handleResponse);
     

    function handleResponse(message){

            var x = message.response;
            if(message.notes != null){
                
                console.log(message.notes.size);
                siteNotes = message.notes;
                
            };
            
            document.getElementById('site-title').innerHTML = x;
            showNotes(siteNotes);

        };
        
    
      
}; 

getHostname();

function showNotes(siteNotes){
    
    //Clear into #notes-list
    var notesList = document.getElementById("notes-list");
    while(notesList.firstChild){
        notesList.removeChild(notesList.firstChild);
    };
    
    //Check if notes exist for this site
    function noNotes(){
        for(var prop in siteNotes){
            if (siteNotes.hasOwnProperty(prop)){
                return false;
            };
        };
        return true;
    };
    
    //Message if there aren't notes
    if (noNotes()){
        let noLi = document.getElementById("notes-list");
        let message = document.createElement("p");
        message.setAttribute("class", "advertise");
        message.innerHTML = "Crea la tua prima nota per questo sito!";
        noLi.appendChild(message);
    };
    
    //Display notes
    for (let x in siteNotes){
        //Title of note
        let p = document.createElement("p");
        p.setAttribute("class", "note");
        p.setAttribute("title", siteNotes[x]);
        p.innerHTML = x;
        notesList.appendChild(p);
        
        
        
        p.addEventListener("click",onClick);
        
        function onClick(){
            
            //Value of note
        
            if (document.querySelector("#current-note") !== null){
                let element = document.getElementById("current-note");
                element.parentNode.removeChild(element);
            };
        
            let secondP = document.createElement("textarea");
            secondP.innerHTML = siteNotes[x];
            secondP.setAttribute("id", "current-note");
            notesList.appendChild(secondP);
            
            //Options of value
            
            var valueOptions = document.getElementById("note-options");
            
            if (valueOptions.hasChildNodes()){
                while(valueOptions.firstChild){
                    valueOptions.removeChild(valueOptions.firstChild);
                };
                
            };
            
            /*Note buttons*/
            //Edit note
            let modifyInput = document.createElement("input");
            modifyInput.setAttribute("id", "edit-note");
            modifyInput.setAttribute("type", "button");
            modifyInput.setAttribute("value", "Modifica");
            valueOptions.appendChild(modifyInput);
            let editThis = function(){return editNote.call(this, x);};
            modifyInput.addEventListener("click", editThis);
            //Delete note
            let deleteInput = document.createElement("input");
            deleteInput.setAttribute("id", "delete-note");
            deleteInput.setAttribute("type", "button");
            deleteInput.setAttribute("value", "Elimina");
            valueOptions.appendChild(deleteInput);
            let deleteThis = function(){return deleteNote.call(this, x, valueOptions);};
            deleteInput.addEventListener("click", deleteThis);
            
            //Paste in clipboard
            secondP.focus();
            secondP.select();
            document.execCommand("copy");
            
        };
        
    };
    
};



function editNote(titleNote){
    
    //Clear into #notes-list
    let notesList = document.getElementById("notes-list");
    while(notesList.firstChild){
        notesList.removeChild(notesList.firstChild);
    };
    
    //Clear into #notes-list
    let noteOpt = document.getElementById("note-options");
    while(noteOpt.firstChild){
        noteOpt.removeChild(noteOpt.firstChild);
    };
    
    /*Create form to add a note*/
    //Form
    let addForm = document.createElement("form");
    addForm.setAttribute("id", "edit-form");
    notesList.appendChild(addForm);
    //Title
    var addTitleInput = document.createElement("input");
    addTitleInput.setAttribute("value", titleNote);
    addForm.appendChild(addTitleInput);
    //Body
    let addBodyInput = document.createElement("input");
    addBodyInput.setAttribute("value", siteNotes[titleNote]);
    addForm.appendChild(addBodyInput);
    //Submit
    let addSubmit = document.createElement("input");
    addSubmit.setAttribute("type", "button");
    addSubmit.setAttribute("value", "Modifica");
    function add(){
        
        if (addTitleInput.value !== "" && addBodyInput.value !== ""){
            
            if (addTitleInput.value !== titleNote){
                delete(siteNotes[titleNote]); 
            };
            
            siteNotes[addTitleInput.value] = addBodyInput.value;
            
            updateNotes();
                        
        } else {
            alert("Ricordati di compilare tutti i campi");
        };
        
    };
    addSubmit.addEventListener("click",add.bind(addTitleInput, addBodyInput));
    addForm.appendChild(addSubmit);
    //Cancel
    let addCancel = document.createElement("input");
    addCancel.setAttribute("type", "button");
    addCancel.setAttribute("value", "Annulla");
    function cancel(){
        showNotes(siteNotes);
    };
    addCancel.addEventListener("click", cancel);
    addForm.appendChild(addCancel);
    //Advertise
    let addAdvertise = document.createElement("p");
    addAdvertise.setAttribute("class", "advertise");
    addAdvertise.innerHTML = "* Ricordati di inserire un titolo diverso da quello delle altre note già presenti su questa pagina";
    addForm.appendChild(addAdvertise);
    
};



function deleteNote(titleNote, noteInputs){
    
    //if(window.confirm('Sicuro di voler eliminare la nota ' + titleNote + '?') === true){};
    while(noteInputs.hasChildNodes()){
            noteInputs.removeChild(noteInputs.firstChild);
        };
        delete siteNotes[titleNote];
        updateNotes();
};



function addNote(){
    
    //Clear into #notes-list
    let notesList = document.getElementById("notes-list");
    while(notesList.firstChild){
        notesList.removeChild(notesList.firstChild);
    };
    
    //Clear into #notes-list
    let noteOpt = document.getElementById("note-options");
    while(noteOpt.firstChild){
        noteOpt.removeChild(noteOpt.firstChild);
    };
    
    /*Create form to add a note*/
    //Form
    let addForm = document.createElement("form");
    addForm.setAttribute("id", "add-form");
    notesList.appendChild(addForm);
    //Title
    var addTitleInput = document.createElement("input");
    addTitleInput.setAttribute("type", "text");
    addTitleInput.setAttribute("placeholder", "Titolo della nota *");
    addForm.appendChild(addTitleInput);
    //Body
    let addBodyInput = document.createElement("textarea");
    addBodyInput.setAttribute("placeholder", "Testo della nota");
    addForm.appendChild(addBodyInput);
    //Submit
    let addSubmit = document.createElement("input");
    addSubmit.setAttribute("type", "button");
    addSubmit.setAttribute("value", "Aggiungi");
    function add(){
        
        if (addTitleInput.value !== "" && addBodyInput.value !== ""){
            
            console.log('Creo nuova nota');
            siteNotes[addTitleInput.value] = addBodyInput.value;
            
            updateNotes();
            
        } else {
            alert("Ricordati di compilare tutti i campi");
        };
        
    };
    addSubmit.addEventListener("click",add.bind(addTitleInput, addBodyInput));
    addForm.appendChild(addSubmit);
    //Cancel
    let addCancel = document.createElement("input");
    addCancel.setAttribute("type", "button");
    addCancel.setAttribute("value", "Annulla");
    function cancel(){
        showNotes(siteNotes);
    };
    addCancel.addEventListener("click", cancel);
    addForm.appendChild(addCancel);
    //Advertise
    let addAdvertise = document.createElement("p");
    addAdvertise.setAttribute("class", "advertise");
    addAdvertise.innerHTML = "* Ricordati di inserire un titolo diverso da quello delle altre note già presenti su questa pagina";
    addForm.appendChild(addAdvertise);
    
};

document.getElementById("button-add").addEventListener("click", addNote);

function backupNotes(){
    
    //var siteName = document.getElementById('site-title').innerHTML;
    var backup = browser.storage.local.get();
    backup.then(downloadB);
    
    function downloadB(backup){
        
        backup = backup.defaultStorage;
        console.log(backup);
        //backup = JSON.parse(backup['defaultStorage']);
        backup = JSON.stringify(backup);
        console.log(backup);
        var urlDownload = "data:text/json;charset=utf-8," + encodeURIComponent(backup);
        var link = document.getElementById('backup-file');
        link.setAttribute("href", urlDownload);
        link.setAttribute("download", "backup.json");
        link.click();
        
    };
    
    
};

document.getElementById("button-download-backup").addEventListener("click", backupNotes);

function logStorageChange(){
    
    console.log('Cambiamenti nello storage');
    browser.storage.local.get().then(function(x){console.log(x);});
    
    showNotes(siteNotes);
    
};

browser.storage.onChanged.addListener(logStorageChange);

function updateNotes(){
    
    var storage = browser.storage.local.get();
    
    storage.then(function(x){
                
        console.log(x);
        let hostname = document.getElementById('site-title').innerHTML;
        x['defaultStorage'][hostname] = siteNotes;
        console.log(x['defaultStorage'][hostname]);
        browser.storage.local.set(x);
        
    });
    
};
    
 