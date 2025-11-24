import axios from "axios";
import type { ChatMessage } from "../types";
import { mockApi } from "./mock";

const USE_MOCK = true;

export const getChatReply = async (messages: ChatMessage[]) => {
  if (USE_MOCK) {
    return mockApi.getChatReply(messages);
  }
  const response = await axios.post("/api/chat", { messages });
  return response.data;
};

export const mintChat = async (
  messages: ChatMessage[],
  userAddress: string
) => {
  if (USE_MOCK) {
    return mockApi.mintChat(messages, userAddress);
  }
  // 这里通常是先上传到 IPFS，然后后端返回 metadata URL
  const response = await axios.post("/api/mints", { messages, userAddress });
  return response.data;
};

// 设置价格
export const setAssetPrice = async (id: string, price: number) => {
  if (USE_MOCK) {
    return mockApi.setAssetPrice(id, price);
  }
  // 调用后端更新数据库，或者只是单纯的链上交互
  const response = await axios.post(`/api/assets/${id}/price`, { price });
  return response.data;
};

// 上架/下架
export const toggleListing = async (id: string, shouldList: boolean) => {
  if (USE_MOCK) {
    return mockApi.toggleListing(id, shouldList);
  }
  const response = await axios.post(`/api/assets/${id}/list`, {
    status: shouldList,
  });
  return response.data;
};

// 购买
export const buyAsset = async (id: string, buyerAddress: string) => {
  if (USE_MOCK) {
    return mockApi.buyAsset(id, buyerAddress);
  }
  // 这里的 API 调用通常是用来通知后端 "链上交易已经完成了，请更新数据库归属权"
  // 实际的扣款动作是在 React 组件里用 wagmi/ethers 唤起钱包完成的
  const response = await axios.post(`/api/assets/${id}/buy`, { buyerAddress });
  return response.data;
};
