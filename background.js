importScripts('./crypto-js.min.js');

const SECRET_KEY = "SECRET_KEY"

export const decryptPayload = (token) => {
    const key = CryptoJS.MD5(SECRET_KEY)
    const iv = CryptoJS.MD5(SECRET_KEY)
    const cipher = CryptoJS.AES.decrypt(token, key, {
        iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
    })
    const resultJSON = cipher.toString(CryptoJS.enc.Utf8);
    const result = JSON.parse(resultJSON)
    return result.data.sql
}

chrome.webRequest.onBeforeRequest.addListener(async function (details) {
    if (details.url.endsWith("/api/Request") && details.method == "POST") {
        // Lấy dữ liệu từ request body
        let requestBody;
        try {
            const postedString = decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes)));
            const tokenArr = JSON.parse(postedString);
            requestBody = (tokenArr || []).map(item => decryptPayload(item));
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {requestBody});
            });
        } catch (error) {
            console.error("Error fetching request body:", error);
        }
    }
}, {urls: ["https://www.bmsonelook.com/*"]}, ["requestBody"]);

