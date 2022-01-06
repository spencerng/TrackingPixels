chrome.contextMenus.create({
    id: "removePixels",
    title: "Clear pixels (locally)",
    contexts: ["all"],
});


chrome.contextMenus.onClicked.addListener(function () {
  var pastTrackers = {
        "google": [],
        "facebook": [],
        "linkedin": [],
        "twitter": [],
        "reddit": []
    }
    var displayedPixels = {
        "google": [],
        "facebook": [],
        "linkedin": [],
        "twitter": [],
        "reddit": []
    }

    chrome.storage.local.set({pastTrackers, displayedPixels});
})
