var channels = ['godjj']; // Channels to initially join

var clientOptions = {
        options: {
            debug: false
        },
        connection: {
            reconnect: true
        },
        channels: channels
    },
    client = new tmi.client(clientOptions);

function handleChat(channel, user, message, self) {
    var name = user.username;

    if (name == ("godjj")) {
        chromeNotification(user['display-name'] + "(" + name + ")", message);
        //儲存紀錄
        chrome.storage.sync.get({
            JJMessage: '{"Message":[]}'
        }, function(items) {
            var messageArr = JSON.parse(items.JJMessage);
            var time = moment().format('MM-DD HH:mm');
            var messageJson = '{"' + time + '": "' + message + '"}';
            messageArr.Message[messageArr.Message.length] = JSON.parse(messageJson);
            if (messageArr.Message.length > 7) messageArr.Message.shift();
            chrome.storage.sync.set({ "JJMessage": JSON.stringify(messageArr) }, function() {});
        });

    }
}
client.addListener('message', handleChat);

//是否開啟聊天室選項
chrome.storage.sync.get({
    getChat: true
}, function(items) {
    if (items.getChat) {
        client.connect();
    }
});

//變更聊天室選項事件
chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (changes.getChat) {
        if (changes.getChat.newValue) {
            client.connect();
        } else {
            client.disconnect();
        }
    }
});


//chrome通知
var notificationId = "chatid";
var notificationNum = 0;
var NOTIFICATION_TEMPLATE_TYPE = {
    BASIC: "basic",
    IMAGE: "image",
    LIST: "list",
    PROGRESS: "progress"
};
var myButton1 = {
    title: "前往實況台",
    iconUrl: "./img/mouse.png"
};

function chromeNotification(name, message) {
    notificationId = notificationId + notificationNum;
    var oneMinuteAsMilliseconds = 1 * 60 * 1000;
    var currentTimeAsMilliseconds = new Date().getTime();
    var notificationOptions = {
        type: NOTIFICATION_TEMPLATE_TYPE.BASIC,
        iconUrl: "./img/twitchNotification.png",
        title: name,
        message: message,
        //contextMessage: "通知的次要內容",
        eventTime: currentTimeAsMilliseconds + oneMinuteAsMilliseconds,
        buttons: [myButton1],
        isClickable: false
    };
    chrome.notifications.create(notificationId, notificationOptions, function(id) {});
}

chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
    if (buttonIndex == 0) {
        chrome.notifications.clear(notificationId, function(message) {
            chrome.tabs.create({ "url": "https://www.twitch.tv/godjj" });
        });
    };
});