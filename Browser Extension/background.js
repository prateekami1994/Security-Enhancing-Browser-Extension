var storage = window.localStorage;

chrome.runtime.onMessage.addListener(gotMessage);

// Load the 10k websites into the local website on load of the browser extnsion
chrome.runtime.onInstalled.addListener(function(d){
    Papa.parse("AlexaSafeSites.csv", {
      download:true,
        complete: function(results) {
        var siteList = [];
        for(i=1;i<results.data.length;i++)
        {
          siteList.push(results.data[i][1]);
        }
        storage.setItem("list", JSON.stringify(siteList));
        }
    });
  })


var value, key;

// Call back function for onMessage
function gotMessage(message, sender, sendResponse) {
    // store the hash of the password in localStorage
    if(message.type==="storingPassword")
    {
        key = "password";
        
        //let userDetails = [];
        let userDetails = JSON.parse(storage.getItem(key));
        if (userDetails === null)
            userDetails = [];
        userDetails.push(message.userInfo);
        storage.setItem(key, JSON.stringify(userDetails));
    }
    // Check if the received password is present in localStorage
    if(message.type==="sendingPassword")
    {
        var present = false;
        let passReceived = message.enteredPassword;
        key = "password";
        let userArray = JSON.parse(storage.getItem(key));
        if(userArray){
        for(i=0;i<userArray.length;i++){
            let passwordStored = userArray[i].pass;
            if(passwordStored === passReceived){
                present = true;
                break;
            }
        }
        }
        sendResponse({presentFlag: present});
    }
    // check for prevention against phishing attack
    if(message.type==="sendingDomainAndPassword")
    {      
        var present = false;
        let passReceived = message.enteredPass;
        let hostnameReceived = message.enteredHost;
        key = "password";
        let userArray = JSON.parse(storage.getItem(key));
        for(i=0;i<userArray.length;i++){
            let passwordStored = userArray[i].pass;
            let hostnameStored = userArray[i].id;
            if(passReceived===passwordStored) {
                if(hostnameReceived != hostnameStored) {
                present = true;
                break;
                }
            }                
            }
        sendResponse({presentFlag: present});
    }
    // Following two are the cases for task 3
    if(message.type=="hostname")
    {
        var hostflag=false;
        var siteList = JSON.parse(storage.getItem("list"));
        if (siteList.indexOf(message.mainhost) != -1)//if it is in the site list
            hostflag = true;

        sendResponse({hostflag: hostflag});
    }
    if(message.type=='host')
    {   
        var siteList = JSON.parse(storage.getItem("list"));
        siteList.push(message.mainhost);
        storage.setItem("list",JSON.stringify(siteList)); 
    }
}