var streamers = ["godjj"]; // 要監控的實況主名稱
var showNotification = true; // 是否顯示通知，預設為開啟
var client = null; // 初始化為 null，在獲取實況台列表後再創建

function chromeNotification(name, message, channelName) {
    var notificationId = "chat_" + channelName + "_" + new Date().getTime();
    var oneMinuteAsMilliseconds = 1 * 60 * 1000;
    var currentTimeAsMilliseconds = new Date().getTime();
    var notificationOptions = {
        type: "basic",
        iconUrl: chrome.runtime.getURL("img/twitchNotification.png"),
        title: name,
        message: message,
        eventTime: currentTimeAsMilliseconds + oneMinuteAsMilliseconds,
        buttons: [{
            title: "前往實況台",
            iconUrl: chrome.runtime.getURL("img/mouse.png")
        }],
        isClickable: true
    };

    // 發送消息到 Service Worker 處理通知
    chrome.runtime.sendMessage({
        type: "SHOW_NOTIFICATION",
        notificationId: notificationId,
        options: notificationOptions
    });
}

function handleChat(channel, user, message, self) {
    var name = user.username;

    // 只有當說話的人是我們要監控的實況主時才處理
    if (streamers.includes(name)) {
        // 過濾掉訂閱或者小奇點的訊息
        var regex = /感謝.*(訂閱|小奇點)!/g;
        if (regex.test(message)) {
            return;
        }

        // 儲存訊息
        chrome.runtime.sendMessage({
            type: "SAVE_MESSAGE",
            channel: channel,
            streamer: user["display-name"] || name,
            message: message
        });

        // 如果開啟了通知設定，才顯示通知
        if (showNotification) {
            // 直接將頻道名稱作為參數傳給通知函數
            chromeNotification("[" + channel + "] " + user["display-name"] + "(" + name + ")", message, channel);
        }
    }
}

function clientConnect(channels) {
    // 建立 client 實例並連接
    var clientOptions = {
        options: {
            debug: false
        },
        connection: {
            reconnect: true
        },
        channels: channels
    };

    client = new tmi.client(clientOptions);
    client.addListener("message", handleChat);
    client.connect();
}


// 初始化聊天室連接
function initChatConnection() {
    // 載入通知設定
    chrome.runtime.sendMessage({
        type: "GET_NOTIFICATION_SETTING"
    }, function (response) {
        if (response && response.getChatNotification !== undefined) {
            showNotification = response.getChatNotification;
        }
    });

    // 從 service worker 請求實況台列表
    chrome.runtime.sendMessage({
        type: "GET_MONITORED_CHANNELS"
    }, function (response) {
        if (response && response.channels) {
            clientConnect(response.channels);
        }
    });
}

// 重新連接聊天室
function reconnectChat(newChannels) {
    if (client) {
        // 斷開舊連接再重新連接
        client.disconnect().then(() => {
            clientConnect(newChannels);
        });
    }
}

// 監聽來自背景腳本的訊息
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === "UPDATE_NOTIFICATION_SETTING") {
        // 更新通知設定
        showNotification = message.getChatNotification;
    }
    else if (message.type === "UPDATE_MONITORED_CHANNELS") {
        // 更新實況台列表並重新連接
        reconnectChat(message.channels);
    }
    return true;
});

initChatConnection();
