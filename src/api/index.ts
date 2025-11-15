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
  const response = await axios.post("/mints", { messages, userAddress });
  return response.data;
};
