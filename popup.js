// Create a new Firebase reference, and a new instance of the Login client
var chatRef = new Firebase('https://blazing-inferno-8771.firebaseio.com/chat');

function chatPost(chatRoom) {
  var past = "";
  chatRoom.once('value', function(nameSnapshot) {
    if (nameSnapshot.val()) {
      past += nameSnapshot.val()
    }
  });
  chatRoom.set( "# " + document.getElementById("chatBody").value + '<br>\n' + past);
  document.getElementById("chatBody").value = "";

  return false;
}


$(document).ready(function() {
  tablink = "";
  chrome.tabs.getSelected(null,function(tab) {
    tablink = new URL(tab.url).hostname.replace('.', '').replace('.', '');
    console.log( tablink);
    var chatRoom = chatRef.child( tablink );
    chatRoom.on('value', function (snapshot) {
      document.getElementById('chatLog').innerHTML = snapshot.val();
      console.log(snapshot.val());
    }, function (errorObject) {
      console.log('The read failed: ' + errorObject.code);
    });

    $("#btnSubmit").click(function(){
        chatPost(chatRoom);
    }); 

  });

});