"use strict";
const common_vendor = require("../common/vendor.js");
const ZHIPU_API_KEY = "39bfaec720ac45458755bcc2be4dbab0.FgMjAva0IsSX1cMi";
const ZHIPU_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const MODEL = "glm-4-flash";
const SYSTEM_PROMPT = `你是"智旅AI"，一个专业的旅游规划助手。你的职责是：
1. 根据用户的需求，推荐旅游目的地、景点、美食
2. 帮助用户规划旅行路线和行程安排
3. 提供旅游攻略、交通建议、住宿推荐
4. 回答与旅游相关的问题

回答要求：
- 回答简洁实用，重点突出
- 推荐景点时附带简要说明
- 行程规划按天排列，清晰明了
- 语气友好热情，像朋友一样交流`;
function buildMessages(messages) {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages
  ];
}
function streamChat(messages, onChunk, onComplete, onError) {
  const requestTask = common_vendor.index.request({
    url: ZHIPU_API_URL,
    method: "POST",
    header: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ZHIPU_API_KEY}`
    },
    data: {
      model: MODEL,
      messages: buildMessages(messages),
      stream: true
    },
    enableChunked: true,
    responseType: "text",
    success: () => {
    },
    fail: (err) => {
      console.error("智谱AI请求失败:", err);
      if (onError) onError(err);
    }
  });
  let fullText = "";
  let buffer = "";
  requestTask.onChunkReceived((res) => {
    var _a, _b, _c;
    const uint8Arr = new Uint8Array(res.data);
    let chunk = "";
    for (let i = 0; i < uint8Arr.length; i++) {
      chunk += String.fromCharCode(uint8Arr[i]);
    }
    try {
      chunk = decodeURIComponent(escape(chunk));
    } catch (e) {
      chunk = uint8ArrToUtf8(uint8Arr);
    }
    buffer += chunk;
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") {
        if (onComplete) onComplete(fullText);
        return;
      }
      try {
        const parsed = JSON.parse(data);
        const delta = (_c = (_b = (_a = parsed.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.delta) == null ? void 0 : _c.content;
        if (delta) {
          fullText += delta;
          if (onChunk) onChunk(delta, fullText);
        }
      } catch (e) {
      }
    }
  });
  return requestTask;
}
function uint8ArrToUtf8(uint8Arr) {
  let str = "";
  let i = 0;
  while (i < uint8Arr.length) {
    let byte1 = uint8Arr[i++];
    if (byte1 < 128) {
      str += String.fromCharCode(byte1);
    } else if (byte1 >= 192 && byte1 < 224) {
      let byte2 = uint8Arr[i++];
      str += String.fromCharCode((byte1 & 31) << 6 | byte2 & 63);
    } else if (byte1 >= 224 && byte1 < 240) {
      let byte2 = uint8Arr[i++];
      let byte3 = uint8Arr[i++];
      str += String.fromCharCode((byte1 & 15) << 12 | (byte2 & 63) << 6 | byte3 & 63);
    } else if (byte1 >= 240) {
      let byte2 = uint8Arr[i++];
      let byte3 = uint8Arr[i++];
      let byte4 = uint8Arr[i++];
      let code = (byte1 & 7) << 18 | (byte2 & 63) << 12 | (byte3 & 63) << 6 | byte4 & 63;
      code -= 65536;
      str += String.fromCharCode(55296 + (code >> 10), 56320 + (code & 1023));
    }
  }
  return str;
}
exports.streamChat = streamChat;
