function putCScript() {
    chrome.tabs.executeScript({
        file: '/js/cscript.js'
    });
}
// =============================================================================
function getId(id) {
    return document.getElementById(id);
}
// =============================================================================
const MANIFEST = chrome.runtime.getManifest();
getId('html-title').innerHTML = MANIFEST.name;
getId('app-icon').src = chrome.extension.getURL(MANIFEST.browser_action.icons[0]);
getId('app-name').innerHTML = MANIFEST.name;
getId('app-version').innerHTML = 'V'+MANIFEST.version;
// =============================================================================
function changeStatus(_text,_class) {
    getId('status').innerHTML = _text;
    getId('status').setAttribute('class', _class);
}
function getCheckStatus() {
    return document.body.contains(document.getElementById('cScript_preventer--check'));
}
function checkStatus(status) {
    if(status==true) {
        changeStatus('Active','active');
        getId('startButton').setAttribute('disabled','disabled');
    } else {
        changeStatus('Inactive','inactive');
        getId('startButton').removeAttribute('disabled');
    }
}
function checkAndExecuteStatus() {
    chrome.tabs.executeScript({
        code: '(' + getCheckStatus + ')();'
    }, (results) => {
        checkStatus(results[0]);
    });
}
// =============================================================================
getId('startButton').addEventListener('click', function(){
    console.log('startButton: clicked');
    putCScript();
    setTimeout(function(){
        checkAndExecuteStatus();
    },100);
});
// =============================================================================
checkAndExecuteStatus();