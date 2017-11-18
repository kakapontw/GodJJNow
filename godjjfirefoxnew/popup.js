document.addEventListener('DOMContentLoaded', function(dcle) {
    var buttonName = ["FBbutton", "Youtubebutton", "LoLTWbutton", "LoLbutton", "SFbutton", "Musicbutton", "Music2button", "MEJJbutton", "Twitchbutton"];
    var buttonUrl = ["https://www.facebook.com/GodJJLOL", "https://www.youtube.com/channel/UCt--8DKolHNzogSofX35fRQ", "https://lol.moa.tw/summoner/show/alimamado", "https://www.op.gg/summoner/userName=xcocox",
        "https://v-league.pro/player/godjj1235566/profile", "https://www.youtube.com/playlist?list=PLicQ4e8xsEiH3AnRUFkkwJVaHHvLi-ylL",
        "https://www.youtube.com/playlist?list=PLBGxXkqJe9DSoclWSk6idRDyTYtmWxlcw", "http://www.ment.com.tw/zh-tw/artist_info.php?id=14", "https://www.twitch.tv/godjj"
    ];
    for (var i = 0; i < buttonName.length; i++) {
        var button = document.getElementById(buttonName[i]);
        button.setAttribute("data-content", buttonUrl[i]);
        button.addEventListener('click', function(ce) {
            browser.tabs.create({ "url": this.getAttribute("data-content") });
        });
    }
    var Newsmarquee = document.getElementById("newsMarquee");
    Newsmarquee.stop();
});
//Message彈出
$(function() {
    $('[data-toggle="popover"]').popover()
})

browser.storage.local.get({
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
            link.onclick = function() { browser.tabs.create({ "url": clearString(this.href) }) };
            document.getElementById("time" + (i + 1)).innerText = key;
            document.getElementById("m" + (i + 1)).appendChild(link);
        } else if (value.length > 15) {
            document.getElementById("m" + (i + 1)).setAttribute("data-container", "body");
            document.getElementById("m" + (i + 1)).setAttribute("data-toggle", "popover");
            document.getElementById("m" + (i + 1)).setAttribute("data-placement", "top");
            document.getElementById("m" + (i + 1)).setAttribute("data-trigger", "hover");
            document.getElementById("m" + (i + 1)).setAttribute("data-content", value);
            document.getElementById("time" + (i + 1)).innerText = key;
            document.getElementById("m" + (i + 1)).innerText = value.substring(0, 15) + " ...";
        } else {
            document.getElementById("time" + (i + 1)).innerText = key;
            document.getElementById("m" + (i + 1)).innerText = value;
        }
    }
});

var lolinfo = new XMLHttpRequest();
lolinfo.open("GET", "https://www.op.gg/summoner/userName=xcocox", true);
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
        document.getElementById("LoL_Win").innerText = WinRatio[1].substring(0, WinRatio[1].length - 1);
        document.getElementById("LoL_Loss").innerText = WinRatio[2].substring(0, WinRatio[2].length - 1);
        document.getElementById("LoL_WinRatio").innerText = WinRatio[WinRatio.length - 2];
    }
}
lolinfo.send();

var lolinfoTW = new XMLHttpRequest();
lolinfoTW.open("GET", "https://lol.moa.tw/Ajax/leaguesolo/7513983", true);
lolinfoTW.onreadystatechange = function() {
    if (lolinfoTW.readyState == 4) {
        var tempStr = lolinfoTW.responseText;
        document.getElementById("LoL_NameTW").innerText = "alimamado";
        var tierRank = tempStr.split("<td id=\"league_tier\">")[1].split(">")[1].split("<")[0];
        var tierRank2 = tempStr.split("<td id=\"league_rank\">")[1].split("</td>")[0];
        var bostr = "";
        var botempStr = tempStr.split("alimamado</a></td>")[1].split("<td class=\"text-center strong\">")[2].split("</td>")[0];
        if (botempStr.match(/icon-minus/g)) {
            var win = 0,
                loss = 0;
            if (botempStr.match(/icon-ok/g)) {
                win = botempStr.match(/icon-ok/g).length;
            }
            if (botempStr.match(/icon-remove/g)) {
                loss = botempStr.match(/icon-remove/g).length;
            }
            bostr = "BO " + win + "W" + loss + "L";
        } else {
            bostr = tempStr.split("alimamado</a></td>")[1].split("<td class=\"text-center strong\">")[2].split("</td>")[0];
        }

        document.getElementById("LoL_tierRankTW").innerText = tierRank + " " + tierRank2;

        var winRank = tempStr.split("alimamado</a></td>")[1].split("<td class=\"text-center strong\">")[1].split("</td>")[0];
        document.getElementById("LoL_LeaguePointsTW").innerText = bostr;
        document.getElementById("LoL_WinTW").innerText = winRank;
        document.getElementById("LoL_LossTW").innerText = "暫無資料";
        document.getElementById("LoL_WinRatioTW").innerText = "暫無資料";
    }
}
lolinfoTW.send();

function getYMdiff(now, dateString) {

    var age = now.get('year') - dateString.get('year');
    var m = now.get('month') - dateString.get('month');
    if (m < 0 || (m === 0 && now.get('date') < dateString.get('date'))) {
        age--;
    }

    var months = (age * 12) - (dateString.get('month') + 1) + (now.get('month') + 1);
    if (now.get('date') < dateString.get('date')) {
        months -= 1;
    }

    months = months % 12;

    if (months < 0) {
        months += 12;
    }

    if (months == 0) {
        return "(" + age + "年" + ")";
    } else if (age == 0) {
        return "(" + months + "個月" + ")";
    } else {
        return "(" + age + "年" + months + "個月" + ")";
    }
}

var twitchinfo = new XMLHttpRequest();
twitchinfo.open("GET", "https://api.twitch.tv/kraken/channels/godjj", true);
twitchinfo.onreadystatechange = function() {
    if (twitchinfo.readyState == 4) {
        var obj = JSON.parse(twitchinfo.responseText);
        //jjinfo       
        // document.getElementById("Twitch_Name").innerText = obj.display_name + "(" + obj.name + ")";
        // document.getElementById("Twitch_Views").innerText = obj.views;
        // document.getElementById("Twitch_Followers").innerText =  obj.followers;
        var CreatedTime = moment.tz(obj.created_at, "Asia/Taipei").format('YYYY/MM/DD');
        // document.getElementById("Twitch_Created").innerText = CreatedTime+" "+ getYMdiff(moment(),moment.tz(obj.created_at,"Asia/Taipei")) ;

    }
}
twitchinfo.setRequestHeader("Client-ID", "630so911da4xpdikvv92t5nrke4h96");
twitchinfo.send();

var teamsinfo = new XMLHttpRequest();
teamsinfo.open("GET", "https://api.twitch.tv/kraken/channels/godjj/teams", true);
teamsinfo.onreadystatechange = function() {
    if (teamsinfo.readyState == 4) {
        var obj = JSON.parse(teamsinfo.responseText);
        var link = document.createElement("a");
        link.href = "https://www.twitch.tv/team/" + obj.teams[0].name;
        link.innerText = obj.teams[0].display_name + "(" + obj.teams[0].name + ")";
        link.onclick = function() { chrome.tabs.create({ "url": clearString(this.href) }) };
        //jjinfo
        // document.getElementById("Twitch_Teams").innerText = "";
        // document.getElementById("Twitch_Teams").appendChild(link);
    }
}
teamsinfo.setRequestHeader("Client-ID", "630so911da4xpdikvv92t5nrke4h96");
teamsinfo.send();

var videoinfo = new XMLHttpRequest();
videoinfo.open("GET", "https://api.twitch.tv/kraken/channels/godjj/videos?broadcast_type=archive", true);
videoinfo.onreadystatechange = function() {
    if (videoinfo.readyState == 4) {
        var obj = JSON.parse(videoinfo.responseText);
        var link = document.createElement("a");
        var title = obj.videos[0].title;
        link.href = obj.videos[0].url;
        if (title.length > 13) {
            link.innerText = title.substring(0, 13) + "...";
        } else {
            link.innerText = title;
        }
        link.onclick = function() { chrome.tabs.create({ "url": clearString(this.href) }) };
        link.setAttribute("title", obj.videos[0].title);
        //jjinfo
        // document.getElementById("Twitch_Updated").innerText = "";
        // document.getElementById("Twitch_Updated").appendChild(link);
    }
}
videoinfo.setRequestHeader("Client-ID", "630so911da4xpdikvv92t5nrke4h96");
videoinfo.send();



var liveinfo = new XMLHttpRequest();
liveinfo.open("GET", "https://api.twitch.tv/kraken/streams/godjj", true);
liveinfo.onreadystatechange = function() {
    if (liveinfo.readyState == 4) {
        var obj = JSON.parse(liveinfo.responseText);
        if (obj.stream != null) {
            document.getElementById("twitchbadge").innerText = "Live";
            document.getElementById("twitchbadge2").innerText = obj.stream.game;
        }
    }
}
liveinfo.setRequestHeader("Client-ID", "630so911da4xpdikvv92t5nrke4h96");
liveinfo.send();

var newsinfo = new XMLHttpRequest();
newsinfo.open("GET", "https://spreadsheets.google.com/feeds/list/1iPm4hNA_v9Rc76TGCwNpXB5bVTfhORhGzxMYvLiLhQo/1/public/values?alt=json", true);
newsinfo.onreadystatechange = function() {
    if (newsinfo.readyState == 4) {
        var obj = JSON.parse(newsinfo.responseText);
        if (obj != null) {
            var dataArr = obj.feed.entry;
            var datalength = dataArr.length;
            var news = dataArr[datalength - 1].gsx$新聞內容.$t;
            var newslink = dataArr[datalength - 1].gsx$相關網址.$t;
            document.getElementById("news").innerText = news;
            var Newsmarquee = document.getElementById("newsMarquee");
            Newsmarquee.setAttribute("behavior", "");
            Newsmarquee.start();
            var Newsbutton = document.getElementById("Newsbutton");
            Newsbutton.addEventListener('click', function(ce) {
                browser.tabs.create({ "url": clearString(newslink) });
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

var lastteninfo = new XMLHttpRequest();
lastteninfo.open("GET", "https://www.op.gg/summoner/matches/ajax/averageAndList/startInfo=0&summonerId=10412193&type=total", true);
lastteninfo.onreadystatechange = function() {
    if (lastteninfo.readyState == 4) {
        var obj = JSON.parse(lastteninfo.responseText);
        var date = [];
        var winOrlose = [];
        var kda = [];
        var temparr = obj.html.split("data-interval='60'>");
        var tempResultarr = obj.html.split("<div class=\"GameItem ");
        for (var i = 1; i < 11; i++) {
            var Seoul = moment.tz(temparr[i].split("</span>")[0], "Asia/Seoul");
            var Taipei = Seoul.clone().tz("Asia/Taipei");
            var heroName = temparr[i].split("<a href=\"\/champion\/")[1].split("\/")[0];
            date[i - 1] = Taipei.format('MMMM Do, HH:mm');
            if (temparr[i].indexOf("Perfect") > -1) {
                kda[i - 1] = Number(temparr[i].split("<span class=\"Kill\">")[1].split("<\/span>")[0]) + Number(temparr[i].split("<span class=\"Assist\">")[1].split("<\/span>")[0]);
                date[i - 1] = [date[i - 1], "(Perfect KDA) " + heroName];
            } else {
                kda[i - 1] = clearString(temparr[i].split("<span class=\"KDARatio \">")[1].split(":")[0]);
                date[i - 1] = [date[i - 1], heroName];
            }
            var tempResult = tempResultarr[i].split("\">")[0];
            if (tempResult.indexOf("Win") > -1) {
                winOrlose[i - 1] = "Victory";
            } else if (tempResult.indexOf("Remake") > -1) {
                winOrlose[i - 1] = "Remake";
            } else {
                winOrlose[i - 1] = "Defeat";
            }
        }
        draw("myChart", date.reverse(), winOrlose.reverse(), kda.reverse());
    }
}
lastteninfo.send();

var lastteninfoTW = new XMLHttpRequest();
lastteninfoTW.open("GET", "https://lol.moa.tw/Ajax/recentgames/104480608", true);
lastteninfoTW.onreadystatechange = function() {
    if (lastteninfoTW.readyState == 4) {
        var obj = lastteninfoTW.responseText;
        var datetemp = [];
        var date = [];
        var winOrlose = [];
        var kda = [];

        var tempDateparr = obj.split("<div class=\"pull-right\">");
        for (var i = 1; i < tempDateparr.length; i += 2) {
            var Taipei = moment.tz(tempDateparr[i].split("</div>")[0], "Asia/Taipei").format('MMMM Do, HH:mm');
            datetemp.push(Taipei);
        }
        var tempChampionsparr = obj.split("/lol-info/champions/tile/");
        for (var i = 1; i < tempChampionsparr.length; i++) {
            date.push([datetemp[i - 1], clearString(tempChampionsparr[i].split("_")[0])]);
        }

        var tempGamearr = obj.split("<tr class=\"game-");
        for (var i = 1; i < tempGamearr.length; i++) {
            if (tempGamearr[i].split("\">")[0] == "win") {
                winOrlose.push("Victory");
            } else if (tempGamearr[i].split("\">")[0] == "lose") {
                winOrlose.push("Defeat");
            } else {
                winOrlose.push("Remake");
            }
        }

        var tempkdaarr = obj.split("title=\"K/D/A\">");
        for (var i = 1; i < tempkdaarr.length; i++) {
            kda.push(clearString(tempkdaarr[i].split("<br/>(")[1].split(")\n</td>")[0]));
        }
        draw("myChartTW", date.reverse(), winOrlose.reverse(), kda.reverse());
    }
}
lastteninfoTW.send();

lastteninfoTW.addEventListener("error", transferFailed, false);

function transferFailed(evt) {
    var link = document.createElement("a");
    link.href = "";
    link.innerText = "由於短期間按太多次 要去戰績網解鎖";
    link.onclick = function() { chrome.tabs.create({ "url": "https://lol.moa.tw/recaptcha/challenge" }) };

    document.getElementById("gameTW").appendChild(link);
    document.getElementById("myChartTW").style.visibility = "hidden";
}