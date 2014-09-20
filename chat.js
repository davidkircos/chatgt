// Create a new Firebase reference
var chatRef = new Firebase('https://blazing-inferno-8771.firebaseio.com/chat');

// generage unique id for user
var macId = null;
chrome.storage.local.get('machine-id', function(item){
  var storedMacId = item['machine-id'];
  if(!storedMacId) {
    storedMacId = Math.random().toString(36).slice(2);
    chrome.storage.local.set({'machine-id':storedMacId});
  }
  macId = storedMacId;
});

// make a color from any string
var stringToColour = function(str) {
    // str to hash
    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
    // int/hash to hex
    for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));
    return colour;
}

// reverse a string
function reverse(s){
    return s.split("").reverse().join("");
}

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
  chatRoom.set( ( macId + "," + document.getElementById("chatBody").value + '\n' + past).substring(0, 1000000) );

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
      document.getElementById('chatLog').innerHTML = "";

      // if we have a chat already
      if (snapshot.val()) {
        // Iterate through messages one by one
        var chat_list = snapshot.val().split("\n");
        for (i in chat_list) {
          // get message
          message = chat_list[i].split(",")[1];
          
          // if message isn't undefined
          if (message) {
            // generate a unique color repersenting the sender
            color_str = chat_list[i].split(",")[0];
            // draw to chatLog
            document.getElementById('chatLog').innerHTML += "<div class='msg'> <span style='background-color:" + stringToColour(color_str) + ";color:" + stringToColour(reverse(color_str)) + "'>##</span> " + message + "</div>";
          }
        }
      } else {
        // if we don't have a chat yet!
        document.getElementById('chatLog').innerHTML = "No chat started yet. Be the first!";
      }
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

