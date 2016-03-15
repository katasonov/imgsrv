chrome.runtime.onMessage.addListener(function (e, t, n) {
	document.body.innerHTML = e.html;
	document.getElementsByTagName('a')[0].click();
	document.body.removeChild(document.getElementsByTagName('a')[0]);
})


// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install") {
    }else if(details.reason == "update") {
    }

    var d = new Date();
    var n = d.getTime()/1000;
    chrome.storage.local.set(
    {"settings": {"installTimeInSec": n, "curShowsInitTime": n, "curShows": 0}});

    chrome.tabs.query({'url': TabFilterList}, function (tabs) {
    if (tabs.length > 0)
    {

      for (i = 0; i < tabs.length; i++) {
        
        //console.log("tab: " + tabs[i].id);
        //chrome.tabs.update(tab.id, {url: link, active: true});
        chrome.tabs.update(tabs[i].id, {url: MAIN_DOMAIN});
      }
      
    }
  });    
});


