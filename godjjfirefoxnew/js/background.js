browser.runtime.onInstalled.addListener(function() {
    browser.tabs.create({ url: "updates.html" });
});

browser.runtime.onStartup.addListener(function() {
    browser.browserAction.setBadgeText({ text: "" });
    browser.storage.local.set({ "OpenNotification": false });
});

browser.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    if(details.frameId === 0) {
        if((details.url.toUpperCase().indexOf('twitch.tv'.toUpperCase()) !== -1)) {
            browser.tabs.sendMessage(details.tabId, {
                onHistoryStateUpdated: 1
            }, function (msg) {
                if (browser.runtime.lastError) { msg = {}; } else { msg = msg || {}; }
            });
            console.log("onHistoryStateUpdated");
        }
    }
});
