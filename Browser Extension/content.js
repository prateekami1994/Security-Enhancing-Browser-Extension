// jQuery action to send the password to local storage on clicking on sign up 
// ===========================================================================
$('button').click(function(event) {
    let text = $(this).text().replace(/[^a-zA-Z ]/g, "");
    text = text.replace(/\s/g,'');
    text = text.trim();
    text = text.toLowerCase();
    if((text === "signup") || (text === "register") || (text === "createanaccount")) {
        let closestForm = $(this).closest('form').find('input');
        for(i=0;i<closestForm.length;i++) {
            if($(closestForm[i]).attr('type') == 'password'){
                let passwordIn = $(closestForm[i]).val();
                var password = CryptoJS.SHA256(passwordIn).toString();
                sendPassword(password);
            }
        }
    }
      
});

// jquery action to check whether the entered password matches the stored password
// ==============================================================================
let hostname = window.location.hostname;

$('input').keyup(function(event){
    if($(this).attr('type')=='password')
    {
        let closestButton = $(this).closest('form').find('button, input');
        for(var i = 0; i < closestButton.length; i++) {
            let text = $(closestButton[i]).text().replace(/[^a-zA-Z ]/g, "");
            text = text.replace(/\s/g,'');
            text = text.trim();
            text = text.toLowerCase();
            if((($(closestButton[i]).attr('type') === 'submit') && ($(closestButton[i]).is('input'))) || (text === 'login') || (text === 'signin'))
            {
                let loginPassword = $(this).val();
                let hashedPassword = CryptoJS.SHA256(loginPassword).toString();
                checkDomainAndPassword(hashedPassword, hostname, $(this));
            }


            else if((text==='signup') || (text==='createanaccount') || (text==='createyouramazonaccount'))
            {   
                let formPassword = $(this).val();
                hashedPassword = CryptoJS.SHA256(formPassword).toString();
                checkPassword(hashedPassword, $(this));
                break;
            }
        }
    
        
    }
});

// jQuery Action to check whether the clicked link is in the alexa top 10k website list or not
// ===============================================================================================
$('a').click(function(d){
    d.preventDefault();
    var link=$(this).attr("href")
    var hostname = $('<a>').prop('href', link).prop('hostname');
    var host=hostname.split('.')
    if ((host.length>=3)&&(host[host.length-2]=="com" || host[host.length-2]=="co"||host[host.length-2]=="gov"||host[host.length-2]=="net"|| host[host.length-2]=="blogspot"||host[host.length-2]=="tumblr"||host[host.length-2]=="ne"||host[host.length-2]=="go"||host[host.length-2]=="edu"||host[host.length-2]=="gob"||host[host.length-2]=="wix"||host[host.length-2]=="typepad"||host[host.length-2]=="ca"||host[host.length-2]=="on"||host[host.length-2]=="gouv"||host[host.length-2]=="pa"))
    {
      var first=host[host.length-3]
      var second=host[host.length-2]
      var third=host[host.length-1]
      var mainhost=first+"."+second+"."+third
    }
    else {
      var first=host[host.length-2]
      var second=host[host.length-1]
      var mainhost=first+"."+second
    }
  
    chrome.runtime.sendMessage({type: "hostname" ,mainhost:mainhost}, function(response){
    if (response.hostflag==true)
      {
     window.open(link,'_self');
      }
      else
      {
  
      swal("This link is not in the Alexa top 10K websites","","warning", {
    buttons: {
      Stop: "Don't Visit",
      Once:  "visit only once",
      whitelist: "Add to whitelist"
    },
  })
  .then((value) => {
    switch (value) {
  
      case "Stop":
      swal("Good Choice","","success");
        break;
  
      case "Once":
        window.open(link,'_self');
        break;
  
      case "whitelist":
  
      chrome.runtime.sendMessage({type: "host" ,mainhost:mainhost});
        window.open(link,'_self')
      break;
    }
  });
  }
    });
  
  });
  






// ================================================================
// Utility functions 
// ================================================================

// ======================================================================
// Function to check if password and domain name match or not


function checkDomainAndPassword(password, hostnameInput, inputTag) {
    chrome.runtime.sendMessage({type: "sendingDomainAndPassword", enteredHost: hostnameInput, enteredPass: password}, function(response){
        if(response.presentFlag == true)
        {
            $.confirm({
                title: 'Phishing Attack',
                content: 'The Password Entered has already been used for a different website!.',    
                boxWidth: '50%',
                useBootStrap: false,
                theme: 'supervan',
                buttons: {
                    ok: function() {
                        inputTag.val('');
                    },
                    cancel: function() {

                    }
                }

            });
    }
    });
}



// ======================================================================
// Function to check if password already present in the local storage


function checkPassword(password, inputTag) {
    chrome.runtime.sendMessage({type: "sendingPassword", enteredPassword: password}, function(response){
        if(response.presentFlag == true)
        {
            $.confirm({
                title: 'Password has been Used',
                content: 'The Entered Password to register has already been used. Kindly Use a different Password',    
                boxWidth: '50%',
                useBootStrap: false,
                theme: 'supervan',
                buttons: {
                    ok: function() {
                        inputTag.val('');
                    }
                }
                      

            });
        }
    });
}

// =====================================================================
// function to send the password and the domain to background and save it in the local storage

function sendPassword(password) {
    let domain = window.location.hostname;
    let userDetails = {
        id: domain,
        pass: password
    };
    chrome.runtime.sendMessage({type: "storingPassword", userInfo: userDetails});

}



