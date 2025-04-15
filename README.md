# JJner aka JJㄋ

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/blinlknnpdpmchjdimpiiinbamgbnbmd)](https://chrome.google.com/webstore/detail/godjj-now/blinlknnpdpmchjdimpiiinbamgbnbmd?hl=zh-TW)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/users/blinlknnpdpmchjdimpiiinbamgbnbmd)]()
[![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/blinlknnpdpmchjdimpiiinbamgbnbmd?label=chrome%20web%20store)]()
[![Mozilla Add-on](https://img.shields.io/amo/v/godjj-now-for-firefox)](https://addons.mozilla.org/zh-TW/firefox/addon/godjj-now-for-firefox/)

方便大家及時了解GodJJ跑去哪邊

### 線上版本

- [Chrome版本](https://chrome.google.com/webstore/detail/godjj-now/blinlknnpdpmchjdimpiiinbamgbnbmd)
- [Firefox版本(維持舊版本GodJJ Now)](https://addons.mozilla.org/zh-TW/firefox/addon/godjj-now-for-firefox/)
- [GitHub](https://github.com/MayGrass/JJner)

### 目前包含

- Facebook、Youtube、歌單等等相關資訊連結
- JJ聊天室資訊
- 自訂新增抓哪台的JJ留言
- 自動點擊"國王的金幣"額外獎勵，其它台同時也通用
- ~~LoL戰績摘要~~(功能已死亡)
- ~~圖奇開台通知(含GodJJ鈴聲)~~ (2.3.2版移除此功能)

### 使用者隱私聲明

此插件沒有蒐集任何使用者資訊，也沒有營利

### 相關授權

使用MIT授權條款

此專案有使用:

- [jQuery](https://jquery.com/)
- [Chart.js](http://www.chartjs.org/)
- [Bootstrap](https://getbootstrap.com/)
- [Moment.js](https://momentjs.com/)
- [tmi.js](https://www.tmijs.org/)
- [arrive.js](https://github.com/uzairfarooq/arrive)
- [Papa Parse](https://www.papaparse.com/)

- JJ台相關圖片已取得使用許可
- Rank&Link icon made by Freepik from <www.flaticon.com>, licensed under CC BY 3.0
- Notification icon made by Darius Dan from <www.flaticon.com>, licensed under CC BY 3.0

### 更新資訊

#### 3.0.0 (Chrome版本)

- 因應Chrome瀏覽器要把Manifest V2淘汰了，更新Manifest V3架構
- 更新Message頁面，支援多重實況台阿接發言通知
- 訊息紀錄保存增加到最大50則
- 設定頁面新增開啟/關閉通知的選項
- 設定頁面新增監控實況台列表的管理功能
- JJ News跑馬燈改為自動更新GODJJ YT實況台最新影片
- 新增崩康 Discord按鈕，點擊即可加入JJ Discord
- 移除LOL相關功能
- 移除已經死掉的超連結

---

#### 2.3.2

- 終止開台通知服務，因 Twitch API v5 將於 2022/02/28 停用
- 由於套件沒有開台通知，更換套件圖示為JJ機器人
- 更新opgg api，讓韓服最新十場的數據可以畫出來
- 開台通知先前嘗試的新方法，有人反應很慢才會通知且會亂叫
- 而目前找不到其他好方法避開新api的限制，功能就忍痛先移除囉
- 之後有時間再來研究看看其他方法，但別抱太大期待QQ
- 另外之前有做Line群組開台通知，是用另外方式做的，功能依舊
- 不過加群組會露出Line的使用名稱，可接受並且想加入的再找我

---

#### 2.3.1

- 開台通知恢復成又快又準不亂叫的舊版方式
- 收到吊飾有動力更新了！ 明年2/28 API停用後就在看情況吧

---

#### 2.3.0

- 更新資料來源＆取得資料的方式，來因應以下變更
- 舊版 Twitch API v5 已棄用，並計劃於 2022/02/28 停用
- 舊版 Google Sheet API 2021/08/15 已停用(突然就不能用)
- 順帶一題，最近不論是瀏覽器套件本身或很多資源都在變更使用方式
- 要用免費又沒有資安疑慮的方式提供服務越來越難
- 之後有些功能找不到好方法避開限制可能就會要停掉了
- 畢竟這套件也已經要四年半了(原來也那麼久了)

---

#### 2.2.0

- 修正無法自動點擊"國王的金幣"額外獎勵的問題
- 並將點金幣功能，延伸至全部Twitch實況都會啟動
- 這代表J群以及其他台的額外獎勵寶箱也會自動點囉
- 另外有的小變更
- 移除峽谷之巔資訊，現在都只打韓服了(台服有時會用)
- 重啟News功能，最近活動比較多，可以幫忙公告一些事情
- 畫面小調整以及部分連結更新

---

#### 2.1.0

- 新增自動點擊"國王的金幣"額外獎勵功能
- 經過測試，獎勵按鈕有跳出來，套件一般是不會有問題
- 如果感覺沒效果，主要可能是在圖奇判定是否能拿獎勵的地方

---

#### 2.0.1

- 細部畫面調整

---

#### 2.0.0

- 2.0版套件來囉！
- 大幅縮減資料頁面大小，並調整部分資料呈現方式
- 另外有新增一些資訊及連結

---

#### 舊版本資訊(1.x.x)

[1_x_x_update.md](./1_x_x_update.md)

## 授權

本套件沿用 [GodJJ Now](https://github.com/kakapontw/GodJJNow) 並取得 kakapontw 授權
