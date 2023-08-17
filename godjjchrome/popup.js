document.addEventListener('DOMContentLoaded', function(dcle) {
    var buttonMap=new Map();
    buttonMap.set("FBbutton", "https://www.facebook.com/GodJJLOL");
    buttonMap.set("Youtubebutton", "https://www.youtube.com/channel/UCt--8DKolHNzogSofX35fRQ");
    buttonMap.set("LoLTWbutton", "https://www.op.gg/summoners/tw/alimamado");
    buttonMap.set("LoLbutton", "https://www.op.gg/summoners/kr/mianhae2");
    buttonMap.set("Musicbutton", "https://www.youtube.com/playlist?list=PLicQ4e8xsEiH3AnRUFkkwJVaHHvLi-ylL");
    buttonMap.set("Music2button", "https://www.youtube.com/playlist?list=PLBGxXkqJe9DSoclWSk6idRDyTYtmWxlcw");
    buttonMap.set("JGamersbutton", "https://www.youtube.com/channel/UCNAmbRgIsM8xKDJR47sLYAw");
    buttonMap.set("Godjjmebutton", "https://godjj.me");
    buttonMap.set("Twitchbutton", "https://www.twitch.tv/godjj");
    buttonMap.forEach((buttonUrl, buttonName)=>{
        var button = document.getElementById(buttonName);
        button.setAttribute("data-content", buttonUrl);
        button.addEventListener('click', function(ce) {
            chrome.tabs.create({ "url": this.getAttribute("data-content") });
        });
    });

    var Newsmarquee = document.getElementById("newsMarquee");
    Newsmarquee.stop();
});
//Message彈出
$(function() {
    $('[data-toggle="popover"]').popover()
})

chrome.storage.sync.get({
    JJMessage: '{"Message":[]}'
}, function(items) {
    var messageArr = JSON.parse(items.JJMessage);
    messageArr.Message.reverse();
    for (var i = 0; i < messageArr.Message.length; i++) {
        var key = Object.keys(messageArr.Message[i]);
        var value = messageArr.Message[i][key];
        if (value.indexOf("https://") > -1 || value.indexOf("http://") > -1) {
            var link = document.createElement("a");
            link.href = value;
            link.innerText = value.substring(0, 30) + " ...";
            link.onclick = function() { chrome.tabs.create({ "url": clearString(this.href) }) };
            document.getElementById("time" + (i + 1)).innerText = key;
            document.getElementById("m" + (i + 1)).appendChild(link);
        } else if (value.length > 12) {
            document.getElementById("m" + (i + 1)).setAttribute("data-container", "body");
            document.getElementById("m" + (i + 1)).setAttribute("data-toggle", "popover");
            document.getElementById("m" + (i + 1)).setAttribute("data-placement", "top");
            document.getElementById("m" + (i + 1)).setAttribute("data-trigger", "hover");
            document.getElementById("m" + (i + 1)).setAttribute("data-content", value);
            document.getElementById("time" + (i + 1)).innerText = key;
            document.getElementById("m" + (i + 1)).innerText = value.substring(0, 12) + " ...";
        } else {
            document.getElementById("time" + (i + 1)).innerText = key;
            document.getElementById("m" + (i + 1)).innerText = value;
        }
    }
});

var lolinfo = new XMLHttpRequest();
lolinfo.open("GET", "https://www.op.gg/summoners/kr/mianhae2", true);
lolinfo.onreadystatechange = function() {
    if (lolinfo.readyState == 4) {
        var tempStr = lolinfo.responseText;
        var tempArr = tempStr.split("<meta name=\"description\" content=\"")[1].split(">")[0].split("/");
        document.getElementById("LoL_Name").innerText = tempArr[0];
        var tierRank = tempArr[1].split(" ");
        var bostr = "";
        if (tempStr.match(/SeriesBackground/g)) {
            var mid = tempStr.split("<div class=\"SeriesBackground\">")[1].split("</div>")[0].split("__spSite __spSite-")[1].split("\"")[0];
            var boItemArr = tempStr.split("<ol class=\"SeriesResults\">")[1].split("</ol>")[0].split("__spSite __spSite-");
            var win = 0,
                loss = 0;
            for (var i = 1; i < boItemArr.length; i++) {
                if (mid < boItemArr[i].split("\"")[0]) {
                    win++;
                } else {
                    loss++;
                }
            }
            bostr = "(BO " + win + "W" + loss + "L)";
        }
        if (tierRank.length == 5) {
            document.getElementById("LoL_tierRank").innerText = tierRank[1] + " " + tierRank[2];
            document.getElementById("LoL_LeaguePoints").innerText = tierRank[3].replace("LP", "") + bostr;
        } else {
            document.getElementById("LoL_tierRank").innerText = tierRank[1];
            document.getElementById("LoL_LeaguePoints").innerText = tierRank[2].replace("LP", "") + bostr;
        }
        var WinRatio = tempArr[2].split(" ");
        document.getElementById("LoL_Win").innerText = WinRatio[1].match(/\d+/);
        document.getElementById("LoL_Loss").innerText = WinRatio[2].match(/\d+/);
        document.getElementById("LoL_WinRatio").innerText = WinRatio[WinRatio.length - 2];
    }
}
lolinfo.send();

var lolinfoTW = new XMLHttpRequest();
lolinfoTW.open("GET", "https://www.op.gg/summoners/tw/alimamado", true);
lolinfoTW.onreadystatechange = function() {
    if (lolinfoTW.readyState == 4) {
        var tempStr = lolinfoTW.responseText;
        var tempArr = tempStr.split("<meta name=\"description\" content=\"")[1].split(">")[0].split("/");
        document.getElementById("LoL_NameTW").innerText = "alimamado";
        var tierRank = tempArr[1].split(" ");
        var bostr = "";
        if (tempStr.match(/SeriesBackground/g)) {
            var mid = tempStr.split("<div class=\"SeriesBackground\">")[1].split("</div>")[0].split("__spSite __spSite-")[1].split("\"")[0];
            var boItemArr = tempStr.split("<ol class=\"SeriesResults\">")[1].split("</ol>")[0].split("__spSite __spSite-");
            var win = 0,
                loss = 0;
            for (var i = 1; i < boItemArr.length; i++) {
                if (mid < boItemArr[i].split("\"")[0]) {
                    win++;
                } else {
                    loss++;
                }
            }
            bostr = "(BO " + win + "W" + loss + "L)";
        }
        if (tierRank.length == 5) {
            document.getElementById("LoL_tierRankTW").innerText = tierRank[1] + " " + tierRank[2];
            document.getElementById("LoL_LeaguePointsTW").innerText = tierRank[3].replace("LP", "") + bostr;
        } else {
            document.getElementById("LoL_tierRankTW").innerText = tierRank[1];
            document.getElementById("LoL_LeaguePointsTW").innerText = tierRank[2].replace("LP", "") + bostr;
        }
        var WinRatio = tempArr[2].split(" ");
        document.getElementById("LoL_WinTW").innerText = WinRatio[1].match(/\d+/);
        document.getElementById("LoL_LossTW").innerText = WinRatio[2].match(/\d+/);
        document.getElementById("LoL_WinRatioTW").innerText = WinRatio[WinRatio.length - 2];
    }
}
lolinfoTW.send();

var liveinfo = new XMLHttpRequest();
liveinfo.open("GET", "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5YhoeZYKzorLHn_YcmqMSPAZ3dZNM7Z5JYSRq9xlpNJr5eESDDrUwoyUgZeOJygGE1qflE2h9PY84/pub?gid=0&single=true&output=csv", true);
liveinfo.onreadystatechange = function() {
    if (liveinfo.readyState == 4) {
        var csvData = Papa.parse(liveinfo.responseText)['data'];
        if (csvData != null) {
            csvData.forEach(function(data){
                var userId = data[0];
                var openStr = data[1];
                var gameName = data[2];
                var title = data[3];

                if (userId == 'GodJJ' && openStr == 'Open') {
                    document.getElementById("twitchbadge").innerText = "Live";
                    document.getElementById("twitchbadge2").innerText = gameName;
                }
            });
        }
    }
}
liveinfo.send();

var newsinfo = new XMLHttpRequest();
newsinfo.open("GET", "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6GqbrusdF8t250d2AQNCHvwr5VANEIk3-ehToq409u07LRGMUK8ssgkVlqWY4q1cvIUUTAPBWVxq2/pub?gid=1520080953&single=true&output=csv", true);
newsinfo.onreadystatechange = function() {
    if (newsinfo.readyState == 4) {
        var csvData = Papa.parse(newsinfo.responseText)['data'];
        if (csvData != null) {
            var dataLength = csvData.length;
            var news = csvData[dataLength - 1][1];
            var newslink = csvData[dataLength - 1][2];
            document.getElementById("news").innerText = news;
            var Newsmarquee = document.getElementById("newsMarquee");
            Newsmarquee.start();
            var Newsbutton = document.getElementById("Newsbutton");
            Newsbutton.addEventListener('click', function(ce) {
                chrome.tabs.create({ "url": clearString(newslink) });
            });
        }
    }
}
newsinfo.send();

function clearString(s) {
    var pattern = new RegExp("[`~!@#$^*()|{}';',\\[\\]<>~！@#￥……*（）;|{}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs += s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

var lastteninfoKR = new XMLHttpRequest();
lastteninfoKR.open("GET", "https://op.gg/api/v1.0/internal/bypass/games/kr/summoners/TGzvX1eyIyQKBL332Its2SDaR3prCEj8k14utEGMRdjbclr4L9orVmbZRw?&hl=zh_TW&game_type=total", true);
lastteninfoKR.onreadystatechange = function() {
    var date = [];
    var winOrlose = [];
    var kda = [];
    if (lastteninfoKR.readyState == 4) {
        var obj = JSON.parse(lastteninfoKR.responseText);
        var datas = obj.data;
        for (var i = 0; i < 10; i++) {
            date[i] = moment.tz(datas[i].created_at, "Asia/Seoul").clone().tz("Asia/Taipei").format('MMMM Do, HH:mm');
            var temp_data = datas[i].myData

            var heroName = krchampionsMap.get(temp_data.champion_id);
            var kill = temp_data.stats.kill
            var assist = temp_data.stats.assist
            var death = temp_data.stats.death
            if (death < 1) {
                kda[i] = kill + assist
                kda[i] = kda[i].toFixed(2);
                date[i] = [date[i], "(Perfect KDA) " + heroName];
            } else {
                kda[i] = (kill + assist) / death
                kda[i] = kda[i].toFixed(2);
                date[i] = [date[i], heroName];
            }

            var result = temp_data.stats.result
            if (result == "WIN") {
                winOrlose.push("Victory");
            } else if (result == "LOSE") {
                winOrlose.push("Defeat");
            } else {
                winOrlose.push("Remake");
            }
        }
        draw("KR_LOL_Last_10_Games", date.reverse(), winOrlose.reverse(), kda.reverse());
    }
}

var lastteninfoTW = new XMLHttpRequest();
lastteninfoTW.open("GET", "https://op.gg/api/v1.0/internal/bypass/games/tw/summoners/_PYN9hIJc4JDHX02vo5HFwzV4l-VdKA8nuOubDfappRRJGpHlgaKgzY5kg?&hl=zh_TW&game_type=total", true);
lastteninfoTW.onreadystatechange = function() {
    var date = [];
    var winOrlose = [];
    var kda = [];
    if (lastteninfoTW.readyState == 4) {
        var obj = JSON.parse(lastteninfoTW.responseText);
        var datas = obj.data;
        for (var i = 0; i < 10; i++) {
            date[i] = moment.tz(datas[i].created_at, "Asia/Seoul").clone().tz("Asia/Taipei").format('MMMM Do, HH:mm');
            var temp_data = datas[i].myData

            var heroName = krchampionsMap.get(temp_data.champion_id);
            var kill = temp_data.stats.kill
            var assist = temp_data.stats.assist
            var death = temp_data.stats.death
            if (death < 1) {
                kda[i] = kill + assist
                kda[i] = kda[i].toFixed(2);
                date[i] = [date[i], "(Perfect KDA) " + heroName];
            } else {
                kda[i] = (kill + assist) / death
                kda[i] = kda[i].toFixed(2);
                date[i] = [date[i], heroName];
            }

            var result = temp_data.stats.result
            if (result == "WIN") {
                winOrlose.push("Victory");
            } else if (result == "LOSE") {
                winOrlose.push("Defeat");
            } else {
                winOrlose.push("Remake");
            }
        }
        draw("TW_LOL_Last_10_Games", date.reverse(), winOrlose.reverse(), kda.reverse());
    }
}

var krchampionsMap=new Map();
championsinfoKR = new XMLHttpRequest();
championsinfoKR.open("GET", "https://op.gg/api/v1.0/internal/bypass/meta/champions?hl=zh_TW", true);
championsinfoKR.onreadystatechange = function() {
    if (championsinfoKR.readyState == 4) {
        krchampionsdatatemp = JSON.parse(championsinfoKR.responseText);
        for(var index in krchampionsdatatemp.data) {
            krchampionsMap.set(krchampionsdatatemp.data[index].id, krchampionsdatatemp.data[index].name);
        }
        lastteninfoKR.send();
        lastteninfoTW.send();
    }
}
championsinfoKR.send();
