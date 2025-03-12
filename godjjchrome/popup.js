document.addEventListener('DOMContentLoaded', function () {
    var buttonMap = new Map();
    buttonMap.set("FBbutton", "https://www.facebook.com/GodJJLOL");
    buttonMap.set("Youtubebutton", "https://www.youtube.com/channel/UCt--8DKolHNzogSofX35fRQ");
    buttonMap.set("Discordbutton", "https://discord.gg/6JnBwBy");
    buttonMap.set("Musicbutton", "https://www.youtube.com/playlist?list=PLicQ4e8xsEiH3AnRUFkkwJVaHHvLi-ylL");
    buttonMap.set("Music2button", "https://www.youtube.com/playlist?list=PLBGxXkqJe9DSoclWSk6idRDyTYtmWxlcw");
    buttonMap.set("JGamersbutton", "https://www.youtube.com/channel/UCNAmbRgIsM8xKDJR47sLYAw");
    buttonMap.set("Godjjmebutton", "https://godjj.me");
    buttonMap.set("Twitchbutton", "https://www.twitch.tv/godjj");
    buttonMap.forEach((buttonUrl, buttonName) => {
        var button = document.getElementById(buttonName);
        button.setAttribute("data-content", buttonUrl);
        button.addEventListener("click", function (ce) {
            chrome.tabs.create({ "url": this.getAttribute("data-content") });
        });
    });
    // 獲取和設置跑馬燈的內容
    fetchLatestYoutubeVideo();
});

// 獲取 YouTube 最新影片資訊
function fetchLatestYoutubeVideo() {
    const channelId = "UCt--8DKolHNzogSofX35fRQ"; // GodJJ 的 YouTube 實況台 ID
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    // 顯示加載中訊息
    const newsElement = document.getElementById("news");
    newsElement.innerText = "正在載入最新影片...";

    // 由於瀏覽器的跨域限制，使用 CORS 代理
    const corsProxy = "https://corsproxy.io/?url=";

    fetch(corsProxy + feedUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            // 解析 XML
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");

            // 檢查是否有解析錯誤
            if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                throw new Error("XML parsing error");
            }

            // 獲取最新的影片條目
            const entries = xmlDoc.getElementsByTagName("entry");

            if (entries.length > 0) {
                const latestEntry = entries[0];
                const title = latestEntry.getElementsByTagName("title")[0].textContent;
                const videoId = latestEntry.getElementsByTagName("yt:videoId")[0].textContent;
                const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

                // 設置跑馬燈內容
                newsElement.innerText = title;
                const newsMarquee = document.getElementById("newsMarquee");
                newsMarquee.setAttribute("behavior", "scroll");

                // 啟用按鈕點擊開啟影片
                const Newsbutton = document.getElementById("Newsbutton");
                // 先移除舊的事件監聽器，避免重複綁定，會導致跑馬燈第一次跑到一半就被重置
                Newsbutton.replaceWith(Newsbutton.cloneNode(true));
                Newsbutton.addEventListener("click", function () {
                    chrome.tabs.create({ "url": videoUrl });
                });
            } else {
                throw new Error("No video entries found");
            }
        })
        .catch(error => {
            console.error("Error fetching YouTube RSS feed:", error);
            document.getElementById("news").innerText = "無法載入最新影片";
        });
}

chrome.storage.sync.get({
    JJMessage: '{"Message":[]}'
}, function (items) {
    var messageArr = JSON.parse(items.JJMessage);
    messageArr.Message.reverse();
    var tbody = document.getElementById("messageTableBody");

    for (var i = 0; i < messageArr.Message.length; i++) {
        var key = Object.keys(messageArr.Message[i])[0]; // 時間
        var value = messageArr.Message[i][key]; // 訊息內容或物件

        // 建立一行的元素
        var tr = document.createElement("tr");

        // 建立編號欄
        var tdIndex = document.createElement("td");
        tdIndex.className = "text-center";
        tdIndex.innerText = (i + 1);

        // 建立時間欄
        var tdTime = document.createElement("td");
        tdTime.className = "text-center";
        tdTime.innerText = key;

        channelInfo = value.channel;
        streamerInfo = value.streamer;
        messageContent = value.message;

        // 建立實況台欄
        var tdChannel = document.createElement("td");
        tdChannel.className = "text-center";
        tdChannel.innerHTML = "<span class='badge' style='background-color: #6441A4;'>" + channelInfo + "</span>";

        // 建立實況台主欄
        var tdStreamer = document.createElement("td");
        tdStreamer.className = "text-center";
        tdStreamer.innerText = streamerInfo;

        // 建立訊息欄
        var tdMsg = document.createElement("td");
        tdMsg.className = "text-center message-cell";
        if (messageContent.indexOf("https://") > -1 || messageContent.indexOf("http://") > -1) {
            var link = document.createElement("a");
            link.href = messageContent;
            link.innerText = messageContent.substring(0, 30) + " ...";
            link.onclick = function (e) {
                e.preventDefault();
                chrome.tabs.create({ "url": this.href });
            };
            tdMsg.appendChild(link);
        } else if (messageContent.length > 12) {
            // 創建一個用於顯示縮略訊息的元素
            var shortMsg = document.createElement("span");
            shortMsg.className = "short-message";
            shortMsg.innerText = messageContent.substring(0, 12) + " ...";

            // 創建一個用於顯示完整訊息的元素（初始隱藏）
            var fullMsg = document.createElement("span");
            fullMsg.className = "full-message";
            fullMsg.innerText = messageContent;
            fullMsg.style.display = "none";

            tdMsg.appendChild(shortMsg);
            tdMsg.appendChild(fullMsg);

            // 同時設置 popover 用於滑鼠 hover 顯示
            tdMsg.setAttribute("data-container", "body");
            tdMsg.setAttribute("data-toggle", "popover");
            tdMsg.setAttribute("data-placement", "top");
            tdMsg.setAttribute("data-trigger", "hover");
            tdMsg.setAttribute("data-content", messageContent);

            // 點擊切換顯示完整/縮略訊息
            tdMsg.addEventListener("click", function (e) {
                var shortMsg = this.querySelector(".short-message");
                var fullMsg = this.querySelector(".full-message");

                if (fullMsg.style.display === "none") {
                    shortMsg.style.display = "none";
                    fullMsg.style.display = "inline";
                } else {
                    shortMsg.style.display = "inline";
                    fullMsg.style.display = "none";
                }

                // 防止事件冒泡
                e.stopPropagation();
            });
        } else {
            tdMsg.innerText = messageContent;
        }

        tr.appendChild(tdIndex);
        tr.appendChild(tdTime);
        tr.appendChild(tdChannel);
        tr.appendChild(tdStreamer);
        tr.appendChild(tdMsg);
        tbody.appendChild(tr);
    }

    //Message彈出
    $("[data-toggle='popover']").popover();
});

// 新增全域點擊事件來關閉已展開的訊息
$(document).on("click", function (e) {
    if (!$(e.target).closest(".message-cell").length) {
        $(".short-message").show();
        $(".full-message").hide();
    }
});

// 新增清除訊息功能
document.getElementById("ClearMessageButton").addEventListener("click", function () {
    chrome.storage.sync.set({ JJMessage: '{"Message":[]}' }, function () {
        // 清除完成後重新載入頁面更新 UI
        location.reload();
    });
});
