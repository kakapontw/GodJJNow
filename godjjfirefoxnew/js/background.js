browser.runtime.onInstalled.addListener(function() {
    browser.tabs.create({ url: "updates.html" });
});