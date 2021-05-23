browser.runtime.onInstalled.addListener(function() {
    browser.tabs.create({ url: "updates.html" });
});

browser.webNavigation.onHistoryStateUpdated.addListener(function(details) {
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
