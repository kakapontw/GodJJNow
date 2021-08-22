function clickPointsButton() {
    try {
        // Get all clickable buttons and click button!
        var elems = document.querySelector('.community-points-summary').querySelectorAll('button');
        elems.forEach(function(currentElem, index, arr) {
            if (index != 0) {
                currentElem.click();
                console.log('Clicked points button!, Time: ' + new Date());
            }
        });
    }
    catch(err) {}
}

// Retry 6 times, total try 1 min (6 * 10s(setTimeout))
const RETRY_NUM = 6;

function initialize(retry) {
    // Initialized check
    function check() {
        var promise = new Promise(function(resolve, reject) {
            setTimeout(function() {
                console.log('Initialized!');
                Arrive.unbindAllArrive();
            
                if (document.body.contains(document.getElementsByClassName('community-points-summary')[0])) {
                    console.log('In channel page');
                    // Pre-click
                    clickPointsButton();
                    // Register button arrive
                    document.getElementsByClassName('community-points-summary').arrive('button', clickPointsButton);
                    // In channel page, no need to retry
                    retry = RETRY_NUM
                    resolve(retry);
                }
                else {
                    retry += 1
                    resolve(retry);
                }
            }, 10000);
        });
        return promise;
    }
     
    check().then(function(retry_message) {
        if (retry_message < RETRY_NUM){
            // Retry initialize, because sometimes the page load will be delayed
            console.log('retry ', retry_message);
            initialize(retry_message)
        }
    });
}

// Pre-initialize
initialize(0)

// Message from background.js
browser.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if ('onHistoryStateUpdated' in msg) {
        initialize(0)
        sendResponse({onHistoryStateUpdated: 'ok'})
        console.log("onHistoryStateUpdated");
    }
});
