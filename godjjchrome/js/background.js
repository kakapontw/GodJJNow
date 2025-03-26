import { DEFAULT_CHANNELS } from './config.js';

async function setupOffscreenDocument() {
    // 確認是否已有文檔存在
    if (await chrome.offscreen.hasDocument()) return;

    await chrome.offscreen.createDocument({
        url: "offscreen.html",
        reasons: ["IFRAME_SCRIPTING", "DOM_SCRAPING"],
        justification: "處理 Twitch 聊天和通知"
    });
    console.log("Offscreen document created");
}

chrome.runtime.onInstalled.addListener(async function () {
    await setupOffscreenDocument();
    chrome.tabs.create({ url: "updates.html" });
});

chrome.runtime.onStartup.addListener(async function () {
    await setupOffscreenDocument();
});

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    if (details.frameId === 0) {
        if ((details.url.toUpperCase().indexOf("twitch.tv".toUpperCase()) !== -1)) {
            chrome.tabs.sendMessage(details.tabId, {
                onHistoryStateUpdated: 1
            }, function (msg) {
                if (chrome.runtime.lastError) { msg = {}; } else { msg = msg || {}; }
            });
            console.log("onHistoryStateUpdated");
        }
    }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // 處理獲取通知設定的請求
    if (message.type === "GET_NOTIFICATION_SETTING") {
        chrome.storage.sync.get({
            getChatNotification: true
        }, function (items) {
            sendResponse({ getChatNotification: items.getChatNotification });
        });
        return true;
    }

    // 處理獲取監控實況台列表的請求
    if (message.type === "GET_MONITORED_CHANNELS") {
        chrome.storage.sync.get({
            monitoredChannels: DEFAULT_CHANNELS
        }, function (items) {
            sendResponse({ channels: items.monitoredChannels });
        });
        return true;
    }

    // 處理實況台列表更新
    if (message.type === "UPDATE_MONITORED_CHANNELS") {
        // 儲存到 storage
        chrome.storage.sync.set({
            monitoredChannels: message.channels
        }, function () {
            console.log("已更新監控實況台列表");
        });

        // 轉發給所有可能需要此信息的頁面
        chrome.runtime.sendMessage({
            type: "UPDATE_MONITORED_CHANNELS",
            channels: message.channels
        });
        return true;
    }

    // 處理顯示通知的請求
    if (message.type === "SHOW_NOTIFICATION") {
        chrome.notifications.create(message.notificationId, message.options, function () {
        });
        return true;
    }

    // 處理儲存訊息的請求
    if (message.type === "SAVE_MESSAGE") {
        chrome.storage.sync.get({
            JJMessage: '{"Message":[]}'
        }, function (items) {
            var messageArr = JSON.parse(items.JJMessage);
            var time = new Date().toLocaleString("zh-TW", {
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }).replace(/\//g, "-");

            // 建立包含實況台和主播資訊的訊息物件
            var messageObj = {
                channel: message.channel,
                streamer: message.streamer,
                message: message.message
            };

            var messageJson = {};
            messageJson[time] = messageObj;

            // 新增訊息到陣列，但不再移除舊訊息
            messageArr.Message.push(messageJson);

            // 檢查訊息總數，如果超過限制則只保留最新的50則
            // 避免 chrome.storage.sync 容量限制問題
            if (messageArr.Message.length > 50) {
                messageArr.Message = messageArr.Message.slice(-50);
            }

            chrome.storage.sync.set({ "JJMessage": JSON.stringify(messageArr) }, function () {
                if (chrome.runtime.lastError) {
                    console.error("儲存訊息失敗:", chrome.runtime.lastError);

                    // 檢查是否為儲存空間配額超出錯誤
                    if (chrome.runtime.lastError.message.includes("QUOTA_BYTES_PER_ITEM")) {
                        console.log("儲存空間已滿，刪除舊訊息");

                        // 刪除最舊的10則訊息
                        messageArr.Message = messageArr.Message.slice(10);

                        // 重新嘗試儲存
                        chrome.storage.sync.set({ "JJMessage": JSON.stringify(messageArr) }, function () {
                            console.log("刪除舊訊息後重新儲存");
                        });
                    }
                } else {
                    console.log("訊息已成功儲存");
                }
            });
        });
        return true;
    }
});

chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
    if (buttonIndex == 0) {
        // 從通知ID中提取頻道名稱
        let channelName = notificationId.split("_")[1];
        if (channelName.startsWith('#')) {
            channelName = channelName.substring(1);
        }
        let channelUrl = "https://www.twitch.tv/" + channelName;

        chrome.notifications.clear(notificationId, function () {
            chrome.tabs.create({ "url": channelUrl });
        });
    }
});
