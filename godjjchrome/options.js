document.getElementById('updatebutton').addEventListener('click', function(ce) {
    chrome.tabs.create({ "url": "updates.html" });
});

//將設置用chrome.storage.sync儲存
function save_options() {
    var getChat = document.getElementById('getChat').checked;
    var getOpen = document.getElementById('getOpen').checked;
    var getSound = document.getElementById('getSound').checked;
    chrome.storage.sync.set({
        getChat: getChat,
        getOpen: getOpen,
        getSound: getSound
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
    chrome.storage.sync.get({
        getChat: true,
        getOpen: true,
        getSound: true
    }, function(items) {
        document.getElementById('getChat').checked = items.getChat;
        document.getElementById('getOpen').checked = items.getOpen;
        document.getElementById('getSound').checked = items.getSound;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);