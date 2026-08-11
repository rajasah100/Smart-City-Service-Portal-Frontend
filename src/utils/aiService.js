import apiRequest from "./apiRequest";

// Send Message to AI
const sendAIMessage = async (message) => {
const { data } = await apiRequest.post("/ai/chat", {
message,
});

return data;
};

// Upload Complaint Images
const uploadComplaintImages = async (formData) => {
const { data } = await apiRequest.post("/ai/upload-images", formData, {
headers: {
"Content-Type": "multipart/form-data",
},
});

return data;
};

// Reset AI Session (Optional)
const resetAISession = async () => {
const { data } = await apiRequest.post("/ai/reset");

return data;
};

const aiService = {
sendAIMessage,
uploadComplaintImages,
resetAISession,
};

export default aiService;
