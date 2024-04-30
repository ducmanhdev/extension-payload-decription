chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.requestBody) {
        console.log('%c* Payload decryption *', 'color: orange; font-weight: bold;', message.requestBody);
    }
});
