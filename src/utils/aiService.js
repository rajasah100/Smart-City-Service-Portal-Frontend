import apiRequest from "./apiRequest";

// AI sahayak lai sandesh (pahile ko kurakani ra website ko bhasha sahit)
const sendAIMessage = async ({ message, history, language }) => {
  const { data } = await apiRequest.post("/ai/chat", { message, history, language });
  return data;
};

const aiService = { sendAIMessage };

export default aiService;
