
function uploadFile(){
        
    console.log('Upload file');
    var file = document.getElementById("upload-input").files[0];
        
    console.log('Caricato ' + file + ' : ' + file.name);
    
    if(file.length <= 0){
            alert("Prima seleziona il tuo backup.");
            return false;
    };
    
    var fr = new FileReader();
    fr.readAsText(file);
    
    fr.onload = function(e) { 

        var result = JSON.parse(e.target.result);
        //var formatted = JSON.stringify(result, null, 2);
        //formatted = result['localStorage'];
        //formatted = JSON.parse(formatted);
        
        console.log(result);
        browser.storage.local.set({'defaultStorage':result});
        alert('Backup ripristinato');
        console.log('Memorizzato file JSON');
        
        browser.storage.local.get().then(function(z){console.log(z);});
        
        
        
  };
  
  browser.storage.onChanged.addListener(gettt);
  
  function gettt(){
      
      let storage = browser.storage.local.get();
      storage.then(onGot);
      
      function onGot(x){
          
          console.log(x);
          
      };
      
  };
  
  
    
    
    
    
  
};
    
document.getElementById("upload-submit").addEventListener("click", uploadFile);