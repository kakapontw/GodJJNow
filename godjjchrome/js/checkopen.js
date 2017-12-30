var notificationPoint = 0;
var alarmInfo = {
    delayInMinutes: 1,
    periodInMinutes: 1
};

chrome.alarms.clearAll();
chrome.alarms.onAlarm.addListener(function(alarm) {
    checkOpen();
});

//是否開啟聊天室選項
chrome.storage.sync.get({
    getOpen: true,
    OpenNotification: false
}, function(items) {
    if (items.getOpen) {
        chrome.alarms.create('openAlarm', alarmInfo);
        notificationPoint = 1;
        // chrome.browserAction.setBadgeText({ text: "" });
        chrome.browserAction.setIcon({path: "/img/sleep.png"});
        chrome.storage.local.set({ "OpenNotification": false }, function() {});
        setTimeout(function() { checkOpen(); }, 2000);
    }
});

//變更聊天室選項事件
chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (changes.getOpen) {
        if (changes.getOpen.newValue) {
            chrome.alarms.create('openAlarm', alarmInfo);
            chrome.storage.local.set({ "OpenNotification": false }, function() {});
            checkOpen();
        } else {
            // chrome.browserAction.setBadgeText({ text: "" });
            chrome.browserAction.setIcon({path: "/img/sleep.png"});
            chrome.alarms.clearAll();
        }
    } else if (changes.OpenNotification) {
        if (changes.OpenNotification.newValue && notificationPoint) {
            openNotification(notificationTitle, notificationMessage);
        }
    }
});

function checkOpen() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.twitch.tv/kraken/streams/godjj", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var obj = JSON.parse(xhr.responseText);
            if (obj.stream != null) {
                // chrome.browserAction.setBadgeText({ text: "8" });
                // chrome.browserAction.setBadgeBackgroundColor({ color: "#CC0000" });
                chrome.browserAction.setIcon({path: "/img/8.png"});
                notificationTitle = obj.stream.channel.status;
                notificationMessage = "JJ開台囉 點這前往實況台";
                chrome.storage.local.set({ "OpenNotification": true }, function() {});
            } else {
                // chrome.browserAction.setBadgeText({ text: "" });
                chrome.browserAction.setIcon({path: "/img/sleep.png"});
                chrome.storage.local.set({ "OpenNotification": false }, function() {});
            }
        }
    }
    xhr.setRequestHeader("Client-ID", "630so911da4xpdikvv92t5nrke4h96");
    xhr.send();
}

//chrome通知
var notificationId = "checkopenid";
var notificationTitle = "JJ開台囉";
var notificationMessage = "點這前往實況台";
var NOTIFICATION_TEMPLATE_TYPE = {
    BASIC: "basic",
    IMAGE: "image",
    LIST: "list",
    PROGRESS: "progress"
};

chrome.notifications.onClicked.addListener(function(id) {
    chrome.notifications.clear(notificationId, function(message) {
        chrome.tabs.create({ "url": "https://www.twitch.tv/godjj" });
    });
});

function openNotification(title, message) {
    var notificationOptions = {
        type: NOTIFICATION_TEMPLATE_TYPE.BASIC,
        iconUrl: "./img/twitchNotification.png",
        title: title,
        message: message,
        isClickable: true
    };
    chrome.notifications.create(notificationId, notificationOptions, function(id) {
        chrome.storage.sync.get({
            getSound: true
        }, function(items) {
            if (items.getSound) {
                audio();
            }
        });
    });
}

function audio() {
    var audio = document.createElement("audio");
    audio.setAttribute("controls", "controls");
    audio.setAttribute("autoplay", "autoplay");
    audio.setAttribute("src", "/audio/88BOU_niniz.mp3");
    audio.setAttribute("type", "audio/mpeg");
    audio.volume = 1;
    document.body.appendChild(audio);
    audio.addEventListener('ended', function() {
        this.remove();
    }, false);
}