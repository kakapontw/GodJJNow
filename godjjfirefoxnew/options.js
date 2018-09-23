document.getElementById('updateButton').addEventListener('click', function(ce) {
    browser.tabs.create({ "url": "updates.html" });
});
document.getElementById('githubButton').addEventListener('click', function(ce) {
    browser.tabs.create({ "url": "https://github.com/kakapontw/GodJJNow" });
});

//將設置用browser.storage.local儲存
function save_options() {
    var getChat = document.getElementById('getChat').checked;
    var getOpen = document.getElementById('getOpen').checked;
    var getSound = document.getElementById('getSound').checked;
    var getSoundVersion = document.getElementById('getSoundVersion').checked;
    browser.storage.local.set({
        getChat: getChat,
        getOpen: getOpen,
        getSound: getSound,
        getSoundVersion: getSoundVersion
    }, function() {
        //提供儲存成功的提示
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 1000);
    });
}

// 將設定調整為預設值的功能
function restore_options() {
    //利用get設定預設值並，無值即取得預設置，有值則使用之前儲存的值
    browser.storage.local.get({
        getChat: true,
        getOpen: true,
        getSound: true,
        getSoundVersion: false
    }, function(items) {
        document.getElementById('getChat').checked = items.getChat;
        document.getElementById('getOpen').checked = items.getOpen;
        document.getElementById('getSound').checked = items.getSound;
        document.getElementById('getSoundVersion').checked = items.getSoundVersion;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);