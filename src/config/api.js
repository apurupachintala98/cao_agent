// API Configuration
export const API_CONFIG = {
  BASE_URL: "http://10.126.192.122:8300",
  ENDPOINTS: {
    CORTEX: "/run_cao_agent",
  },
  APPLICATION_NAME: "CAO",
  DEFAULT_USER_ID: "test_user_1025",
}

// Build payload for API request
export const buildChatPayload = (userMessage, userId = API_CONFIG.DEFAULT_USER_ID) => {
  return {
    application_name: API_CONFIG.APPLICATION_NAME,
    user_identity: userId,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: userMessage,
          },
        ],
      },
    ],
  }
}
