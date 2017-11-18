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
        browserNotification(user['display-name'] + "(" + name + ")", message);
        //儲存紀錄
        browser.storage.local.get({
            JJMessage: '{"Message":[]}'
        }, function(items) {
            var messageArr = JSON.parse(items.JJMessage);
            var time = moment().format('YYYY-MM-DD HH:mm:ss');
            var messageJson = '{"' + time + '": "' + message + '"}';
            messageArr.Message[messageArr.Message.length] = JSON.parse(messageJson);
            if (messageArr.Message.length > 7) messageArr.Message.shift();
            browser.storage.local.set({ "JJMessage": JSON.stringify(messageArr) }, function() {});
        });

    }
}
client.addListener('message', handleChat);

//是否開啟聊天室選項
browser.storage.local.get({
    getChat: true
}, function(items) {
    if (items.getChat) {
        client.connect();
    }
});

//變更聊天室選項事件
browser.storage.onChanged.addListener(function(changes, areaName) {
    if (changes.getChat) {
        if (changes.getChat.newValue) {
            client.connect();
        } else {
            client.disconnect();
        }
    }
});


//通知
var notificationId = "chatid";
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

function browserNotification(name, message) {
    var oneMinuteAsMilliseconds = 1 * 60 * 1000;
    var currentTimeAsMilliseconds = new Date().getTime();
    var notificationOptions = {
        type: NOTIFICATION_TEMPLATE_TYPE.BASIC,
        iconUrl: "./img/twitchNotification.png",
        title: name,
        message: message,
        //contextMessage: "通知的次要內容",
        eventTime: currentTimeAsMilliseconds + oneMinuteAsMilliseconds,
        isClickable: false
    };
    browser.notifications.create(notificationId, notificationOptions, function(id) {});
}

browser.notifications.onClicked.addListener(function(notificationId, buttonIndex) {
    if (buttonIndex == 0) {
        browser.notifications.clear(notificationId, function(message) {
            browser.tabs.create({ "url": "https://www.twitch.tv/godjj" });
        });
    };
});