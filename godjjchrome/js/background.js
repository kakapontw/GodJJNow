chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.create({ url: "updates.html" });
});

chrome.runtime.onStartup.addListener(function() {
    chrome.browserAction.setBadgeText({ text: "" });
    chrome.storage.sync.set({ "OpenNotification": false }, function() {});
});

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    if(details.frameId === 0) {
        if((details.url.toUpperCase().indexOf('twitch.tv'.toUpperCase()) !== -1)) {
            chrome.tabs.sendMessage(details.tabId, {
                onHistoryStateUpdated: 1
            }, function (msg) {
                if (chrome.runtime.lastError) { msg = {}; } else { msg = msg || {}; }
            });
            console.log("onHistoryStateUpdated");
        }
    }
});
