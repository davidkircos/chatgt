// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.getSelected(null,function(tab) {
    var tablink = tab.url;
    document.body.innerHTML += tablink;
  });
});
