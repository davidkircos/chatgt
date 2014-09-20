// Create a new Firebase reference
var chatRef = new Firebase('https://blazing-inferno-8771.firebaseio.com/chat');

// post a new message to given chatRoom
function chatPost(chatRoom) {
  var past = "";
  chatRoom.once('value', function(nameSnapshot) {
    // Take old chat content
    if (nameSnapshot.val()) {
      past += nameSnapshot.val()
    }
  });
  // add our new message to it!
  chatRoom.set( ("# " + document.getElementById("chatBody").value + '<br>\n' + past).substring(0, 1000000) );

  // clear input field
  document.getElementById("chatBody").value = "";
}

$(document).ready(function() {
  // initilise url storing variable
  tablink = "";

  // Once we figure out the url for the page we are on 
  // we can open the chat for it
  chrome.tabs.getSelected(null,function(tab) {
    // simplify url
    tablink = new URL(tab.url).hostname.replace('.', '').replace('.', '');
    
    // get chat for url
    var chatRoom = chatRef.child( tablink );

    // on chat update, update view
    chatRoom.on('value', function (snapshot) {
      document.getElementById('chatLog').innerHTML = snapshot.val();
    }, function (errorObject) {
      // fail gracefully! pretty good for a hackathon eh?
      console.log('The read failed: ' + errorObject.code);
    });

    // Tie sending to chat to the button
    $("#btnSubmit").click(function(){
        chatPost(chatRoom);
    }); 

  });

  // Prevent Form from reloading page
  $( "#chatForm" ).submit(function( event ) {
    event.preventDefault();
  });

});

