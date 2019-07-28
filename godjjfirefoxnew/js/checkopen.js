var notificationPoint = 0;
var alarmInfo = {
    delayInMinutes: 1,
    periodInMinutes: 1
};

browser.alarms.clearAll();
browser.alarms.onAlarm.addListener(function(alarm) {
    checkOpen();
});

var count = 0;

//是否開啟聊天室選項
browser.storage.local.get({
    getOpen: true,
    OpenNotification: false
}, function(items) {
    if (items.getOpen) {
        browser.alarms.create('openAlarm', alarmInfo);
        notificationPoint = 1;
        // browser.browserAction.setBadgeText({ text: "" });
        browser.browserAction.setIcon({path: "/img/sleep.png"});
        browser.storage.local.set({ "OpenNotification": false });
        setTimeout(function() { checkOpen(); }, 2000);
    }
});

//變更聊天室選項事件
browser.storage.onChanged.addListener(function(changes, areaName) {
    if (changes.getOpen) {
        if (changes.getOpen.newValue) {
            browser.alarms.create('openAlarm', alarmInfo);
            browser.storage.local.set({ "OpenNotification": false });
            checkOpen();
        } else {
            // browser.browserAction.setBadgeText({ text: "" });
            browser.browserAction.setIcon({path: "/img/sleep.png"});
            browser.alarms.clearAll();
        }
    } else if (changes.OpenNotification) {
        if (changes.OpenNotification.newValue && notificationPoint) {
            openNotification(notificationTitle, notificationMessage);
        }
    }
});

function checkOpen() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.twitch.tv/kraken/streams/11561802", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var obj = JSON.parse(xhr.responseText);
            if (obj.stream != null) {
                // browser.browserAction.setBadgeText({ text: "8" });
                // browser.browserAction.setBadgeBackgroundColor({ color: "#CC0000" });
                browser.browserAction.setIcon({path: "/img/8.png"});
                notificationTitle = obj.stream.channel.status;
                notificationMessage = "JJ開台囉 點這前往實況台";
                if (count == 0) {
                    browser.storage.local.set({ "OpenNotification": true });
                    count++;
                }
            } else {
                if (count > 0) {
                    count--;
                }
                // browser.browserAction.setBadgeText({ text: "" });
                browser.browserAction.setIcon({path: "/img/sleep.png"});
                browser.storage.local.set({ "OpenNotification": false });
            }
        }
    }
    xhr.setRequestHeader("Accept", "application/vnd.twitchtv.v5+json");
    xhr.setRequestHeader("Client-ID", "630so911da4xpdikvv92t5nrke4h96");
    xhr.send();
}

//通知
var notificationId = "checkopenid";
var notificationNum = 0;
var notificationTitle = "JJ開台囉";
var notificationMessage = "點這前往實況台";
var NOTIFICATION_TEMPLATE_TYPE = {
    BASIC: "basic",
    IMAGE: "image",
    LIST: "list",
    PROGRESS: "progress"
};

browser.notifications.onClicked.addListener(function(id) {
    browser.notifications.clear(notificationId, function(message) {
        browser.tabs.create({ "url": "https://www.twitch.tv/godjj" });
    });
});

function openNotification(title, message) {
    notificationId = notificationId + notificationNum;
    var notificationOptions = {
        type: NOTIFICATION_TEMPLATE_TYPE.BASIC,
        iconUrl: "./img/twitchNotification.png",
        title: title,
        message: message,
        isClickable: true
    };
    browser.notifications.create(notificationId, notificationOptions, function(id) {
        browser.storage.local.get({
            getSound: true
        }, function(items) {
            if (items.getSound) {
                audio();
            }
        });
    });
}

function audio() {
    browser.storage.local.get({
        getSoundVersion: false
    }, function(items) {
        var soundVersion = "/audio/88BOU.wav"
        if (items.getSoundVersion) {
            soundVersion = "/audio/88BOU_niniz.wav"
        }
        var audio = document.createElement("audio");
        audio.setAttribute("controls", "controls");
        audio.setAttribute("autoplay", "autoplay");
        audio.setAttribute("src", soundVersion);
        audio.setAttribute("type", "audio/wav");
        audio.volume = 1;
        document.body.appendChild(audio);
        audio.addEventListener('ended', function() {
            this.remove();
        }, false);
    });
}