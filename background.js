// Create a new Firebase reference
var chatRef = new Firebase('https://blazing-inferno-8771.firebaseio.com/chat');

// update ChatGT count
function updateChatGT(tab) {
	//chrome.browserAction.setBadgeText({text: changeInfo.url}); 
   	var tablink = new URL(tab.url).hostname.replace('.', '').replace('.', '');

    // remove www
    if (tablink.substring(0, 3) == "www") {
      tablink = tablink.substring(3, tablink.length);
    }

  	// get chat for url
    var chatRoom = chatRef.child( tablink );

    var chat_len = -1;
    // check chat room
    chatRoom.on('value', function (snapshot) {

      // if we have a chat already
      if (snapshot.val()) {
        // Cout chat messages
        var chat_list_len = snapshot.val().split("\n").length - 1;
      	
      	// save len
      	chrome.browserAction.setBadgeText({text: chat_list_len.toString() }); 

      } else {
        // if we don't have a chat yet!
        // set to empty
      	chrome.browserAction.setBadgeText({text: "" }); 

      }
    }, function (errorObject) {
      // fail gracefully! pretty good for a hackathon eh?
      console.log('The read failed: ' + errorObject.code);
    });
}

// On any page loading change!
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.active) {
  	updateChatGT(tab);
  }
});

// On any tab switches!
chrome.tabs.onActivated.addListener( function (tabId, changeInfo, tab) {
	chrome.tabs.getSelected(null, function (tab) {
		updateChatGT(tab);
	});
});

