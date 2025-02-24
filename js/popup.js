function putCScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTabId = tabs[0].id;
        chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            files: ['/js/cscript.js']
        });
    });
}
// =============================================================================
function getId(id) {
    return document.getElementById(id);
}
// =============================================================================
const MANIFEST = chrome.runtime.getManifest();
getId('html-title').innerHTML = MANIFEST.name;
getId('app-icon').src = chrome.runtime.getURL(MANIFEST.action.default_icon);
getId('app-name').innerHTML = MANIFEST.name;
getId('app-version').innerHTML = 'V' + MANIFEST.version;
// =============================================================================
function changeStatus(_text, _class) {
    getId('status').innerHTML = _text;
    getId('status').setAttribute('class', _class);
}
function getCheckStatus() {
    return document.body.contains(document.getElementById('cScript_preventer--check'));
}
function checkStatus(status) {
    if (status) {
        changeStatus('Active', 'active');
        getId('startButton').setAttribute('disabled', 'disabled');
    } else {
        changeStatus('Inactive', 'inactive');
        getId('startButton').removeAttribute('disabled');
    }
}
function checkAndExecuteStatus() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0] && tabs[0].id) {
            const activeTabId = tabs[0].id;
            chrome.scripting.executeScript(
            {
                target: { tabId: activeTabId },
                func: getCheckStatus
            }, (results) => {
                checkStatus(results && results[0] && results[0].result);
            });
        }
    });
}
// =============================================================================
getId('startButton').addEventListener('click', function () {
    console.log('startButton: clicked');
    putCScript();
    setTimeout(function () {
        checkAndExecuteStatus();
    }, 100);
});
// =============================================================================
checkAndExecuteStatus();
