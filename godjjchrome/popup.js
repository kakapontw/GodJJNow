document.addEventListener('DOMContentLoaded', function(dcle) {
    var buttonMap=new Map();
    buttonMap.set("FBbutton", "https://www.facebook.com/GodJJLOL");
    buttonMap.set("Youtubebutton", "https://www.youtube.com/channel/UCt--8DKolHNzogSofX35fRQ");
    buttonMap.set("LoLTWbutton", "https://lol.moa.tw/summoner/show/alimamado");
    buttonMap.set("LoLbutton", "https://www.op.gg/summoner/userName=TWITCHGODJJ");
    buttonMap.set("Musicbutton", "https://www.youtube.com/playlist?list=PLicQ4e8xsEiH3AnRUFkkwJVaHHvLi-ylL");
    buttonMap.set("Music2button", "https://www.youtube.com/playlist?list=PLBGxXkqJe9DSoclWSk6idRDyTYtmWxlcw");
    buttonMap.set("MEJJbutton", "http://www.ment.com.tw/zh-tw/artist_info.php?id=14");
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
lolinfo.open("GET", "https://www.op.gg/summoner/userName=TWITCHGODJJ", true);
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

var tier_dict = {'31':'最强王者','30':'傲世宗师','29':'超凡大师','28':'璀璨钻石','27':'华贵铂金','26':'荣耀黄金','25':'不屈白银','24':'英勇黄铜','23':'坚韧黑铁'};
var rank_dict = {'0':'I','1':'II','2':'III','3':'IIII'};
var lolinfoCN = new XMLHttpRequest();
lolinfoCN.open("GET", "https://lol.sw.game.qq.com/lol/commact/?proj=TopCanyon&c=ActionUser&a=UserRankList&e_num=25&Page=1&SearchName=GODJJ", true);
lolinfoCN.onreadystatechange = function() {
    if (lolinfoCN.readyState == 4) {
        var tempStr = lolinfoCN.responseText;
        var dataArr = JSON.parse(tempStr.split(" = ")[1]);
        document.getElementById("LoL_NameCN").innerText = dataArr.list[0].name;

        var check_list = ["31", "30", "29"]
        if(check_list.includes(dataArr.list[0].tier)){
            document.getElementById("LoL_tierRankCN").innerText = tier_dict[dataArr.list[0].tier];
        } else {
            document.getElementById("LoL_tierRankCN").innerText = tier_dict[dataArr.list[0].tier] + rank_dict[dataArr.list[0].rank];
        }

        document.getElementById("LoL_LeaguePointsCN").innerText = dataArr.list[0].league_points;
        
        var lolWinCN = parseInt(dataArr.list[0].total_wins);
        var lolLossTw = parseInt(dataArr.list[0].total_losses) + parseInt(dataArr.list[0].total_leaves);
        var lolWinRatioTw = Math.round((lolWinCN*100/(lolWinCN+lolLossTw))) + '%';

        document.getElementById("LoL_WinCN").innerText = dataArr.list[0].total_wins;
        document.getElementById("LoL_LossCN").innerText = parseInt(dataArr.list[0].total_losses) + parseInt(dataArr.list[0].total_leaves);
        document.getElementById("LoL_WinRatioCN").innerText = lolWinRatioTw;
    }
}
// lolinfoCN.send();

var lolinfoTW = new XMLHttpRequest();
lolinfoTW.open("GET", "https://lol.moa.tw/Ajax/rankeddashboard/7513983/RANKED_SOLO_5x5", true);
lolinfoTW.onreadystatechange = function() {
    if (lolinfoTW.readyState == 4) {
        var tempStr = lolinfoTW.responseText;
        document.getElementById("LoL_NameTW").innerText = "alimamado";
        try {
            var tierRank = tempStr.split("<td id=\"league_tier\">")[1].split("<")[0];
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

            if(tierRank2.indexOf("NA") > -1){
                document.getElementById("LoL_tierRankTW").innerText = tierRank
            }else{
                document.getElementById("LoL_tierRankTW").innerText = tierRank + " " + tierRank2;
            }

            var lolWinTw = tempStr.split("alimamado</a></td>")[1].split("<td class=\"text-center strong\">")[1].split("</td>")[0];
            var lolLossTw = tempStr.split("alimamado</a></td>")[1].split("<td class=\"hide text-center strong\">")[1].split("</td>")[0];
            var lolWinRatioTw = tempStr.split("alimamado</a></td>")[1].split("<td class=\"hide text-center strong\">")[2].split("</td>")[0];
            document.getElementById("LoL_LeaguePointsTW").innerText = bostr;
            document.getElementById("LoL_WinTW").innerText = lolWinTw;
            document.getElementById("LoL_LossTW").innerText = lolLossTw;
            document.getElementById("LoL_WinRatioTW").innerText = lolWinRatioTw;
        } catch (error) {
            console.log(error)
        }
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

var lastteninfo = new XMLHttpRequest();
lastteninfo.open("GET", "https://www.op.gg/summoner/matches/ajax/averageAndList/startInfo=0&summonerId=83588455&type=total", true);
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
        draw("KR_LOL_Last_10_Games", date.reverse(), winOrlose.reverse(), kda.reverse());
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
            var Taipei = moment.tz(tempDateparr[i].split("</div>")[0].split("</stats>")[1].split("</span>")[0], "YYYY-MM-DD HH:mm:ss", "Asia/Taipei").format('MM/DD, HH:mm');
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
        draw("TW_LOL_Last_10_Games", date.reverse(), winOrlose.reverse(), kda.reverse());
    }
}
lastteninfoTW.send();

lastteninfoTW.addEventListener("error", transferFailed, false);

function transferFailed(evt) {
    var link = document.createElement("a");
    link.href = "";
    link.innerText = "由於短期間按太多次 要去戰績網解鎖";
    link.onclick = function() { chrome.tabs.create({ "url": "https://lol.moa.tw/recaptcha/challenge" }) };

    document.getElementById("last10Games").appendChild(link);
    document.getElementById("TW_LOL_Last_10_Games").style.visibility = "hidden";
}
