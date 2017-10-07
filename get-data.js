
var currentHostname = window.location.hostname;
var siteName = currentHostname;

if (currentHostname.indexOf("www.") === 0){
    siteName = currentHostname.slice(4);
};

browser.runtime.sendMessage({response:siteName});

//Get notes from current site
var data = browser.storage.local.get("defaultStorage");


data.then(onGot);

function onGot(data){
    
    if ((typeof data.defaultStorage) !== 'undefined'){
        
        console.log(data.defaultStorage);
        console.log('Esiste');
        
        data = data.defaultStorage;
        data = data[siteName];
        browser.runtime.sendMessage({response:siteName, notes:data});
        
    } else {
        
        
        console.log('Database non esistente');
        
        let setStore = browser.storage.local.set({'defaultStorage' : {}});
        console.log('Creato nuovo database');
        
        setStore.then(function(){
            
            browser.runtime.sendMessage({response:siteName, notes:data});
            
        });
        
    };
      
};
        