import type { ChatMessage } from "../types";

// 模拟后端AI回复的延迟
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  async getChatReply(messages: ChatMessage[]): Promise<{ reply: string }> {
    await sleep(800);
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase();
    if (lastMessage.includes("rwa")) {
      return {
        reply:
          "RWA stands for Real-World Asset, which refers to the tokenization of tangible and intangible assets from the physical world onto the blockchain.",
      };
    }
    return { reply: "This is a mocked response. I'm a friendly AI assistant." };
  },

  async mintChat(
    messages: ChatMessage[],
    userAddress: string
  ): Promise<{ metadataUrl: string }> {
    await sleep(1500);
    if (!messages || messages.length === 0 || !userAddress) {
      throw new Error("Invalid conversation data provided.");
    }
    // 模拟IPFS上传失败的情况
    if (Math.random() > 0.9) {
      throw new Error("Failed to upload metadata to IPFS.");
    }
    console.log("Minting for user:", userAddress);
    return { metadataUrl: `ipfs://QmZ1a2b3c4d5e6f7g8h9i0j...${Date.now()}` };
  },
};
