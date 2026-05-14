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
function createChatRequest(messages) {
  const body = {
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
    ],
    stream: true
  };
  return fetch(ZHIPU_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ZHIPU_API_KEY}`
    },
    body: JSON.stringify(body)
  });
}
async function streamChat(messages, onChunk, onComplete, onError) {
  var _a, _b, _c;
  try {
    const response = await createChatRequest(messages);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API请求失败: ${response.status} ${errorText}`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let fullText = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
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
    }
    if (onComplete) onComplete(fullText);
  } catch (e) {
    common_vendor.index.__f__("error", "at api/zhipu.js:84", "智谱AI请求异常:", e);
    if (onError) onError(e);
  }
}
exports.streamChat = streamChat;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/zhipu.js.map
