import axios from "axios";
import type { Message } from "../entities/types";

if (window.location.hostname === "localhost") {
  axios.defaults.baseURL = "http://localhost:8000/api/v1";
} else {
  axios.defaults.baseURL = "https://api.skinnova.beauty/api/v1";
}

const api = axios.create({
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

async function chatLLM(prompt: Message): Promise<string> {
  try {
    var langPrompt = {
      messages: [prompt],
    };
    const response = await api.post("/llm/chat", langPrompt);
    if (response.status !== 200) {
      console.error("Error communicating with LLM API:", response.data);
      return Promise.reject("Something went wrong with LLM API");
    } else {
      if (!response.data || !response.data.result) {
        return Promise.reject("No response from LLM API");
      }
      return response.data.result;
    }
  } catch (error) {
    console.error("Error communicating with LLM API:", error);
    throw error;
  }
}

export { chatLLM };
