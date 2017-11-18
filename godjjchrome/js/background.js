chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.create({ url: "updates.html" });
});

chrome.runtime.onStartup.addListener(function() {
    chrome.browserAction.setBadgeText({ text: "" });
    chrome.storage.sync.set({ "OpenNotification": false }, function() {});
});