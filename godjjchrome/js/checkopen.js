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
    xhr.open("GET", "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5YhoeZYKzorLHn_YcmqMSPAZ3dZNM7Z5JYSRq9xlpNJr5eESDDrUwoyUgZeOJygGE1qflE2h9PY84/pub?gid=0&single=true&output=csv", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var csvData = Papa.parse(xhr.responseText)['data'];
            if (csvData != null) {
                csvData.forEach(function(data){
                    var userId = data[0];
                    var openStr = data[1];
                    var gameName = data[2];
                    var title = data[3];

                    if (userId == 'GodJJ') {
                        if (openStr == 'Open') {
                            // chrome.browserAction.setBadgeText({ text: "8" });
                            // chrome.browserAction.setBadgeBackgroundColor({ color: "#CC0000" });
                            chrome.browserAction.setIcon({path: "/img/8.png"});
                            notificationTitle = title;
                            notificationMessage = "JJ開台囉 點這前往實況台";
                            chrome.storage.local.set({ "OpenNotification": true }, function() {});
                        } else {
                            // chrome.browserAction.setBadgeText({ text: "" });
                            chrome.browserAction.setIcon({path: "/img/sleep.png"});
                            chrome.storage.local.set({ "OpenNotification": false }, function() {});
                        }
                    }
                });
            }
        }
    }
    xhr.send();
}

//chrome通知
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

chrome.notifications.onClicked.addListener(function(id) {
    chrome.notifications.clear(notificationId, function(message) {
        chrome.tabs.create({ "url": "https://www.twitch.tv/godjj" });
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
    chrome.storage.sync.get({
        getSoundVersion: false
    }, function(items) {
        var soundVersion = "/audio/88BOU.mp3"
        if (items.getSoundVersion) {
            soundVersion = "/audio/jungle_city.mp3"
        }
        var audio = document.createElement("audio");
        audio.setAttribute("controls", "controls");
        audio.setAttribute("autoplay", "autoplay");
        audio.setAttribute("src", soundVersion);
        audio.setAttribute("type", "audio/mpeg");
        audio.volume = 1;
        document.body.appendChild(audio);
        audio.addEventListener('ended', function() {
            this.remove();
        }, false);
    });
}