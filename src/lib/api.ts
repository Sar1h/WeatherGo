export interface ChatMessage {
    role: "user" | "agent";
    content: string;
    timestamp?: string;
}

export async function sendMessageToAgent(message: string): Promise<string> {
    const API_URL = "https://api-dev.provue.ai/api/webapp/agent/test-agent";
    const ROLL_NUMBER = "2023201002";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: message,
                stream: false,
                // Attempting to inject roll number as threadId/userId if supported, 
                // though the simple curl example didn't strictly require it.
                // We add it to be safe based on pdf requirements mentioning it.
                threadId: ROLL_NUMBER,
            }),
        });

        if (!response.ok) {
            // Try to get error text
            const errorText = await response.text();
            console.error("API Error:", response.status, errorText);
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        // Checking content type to handle text vs json
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log("API RESPONSE DATA:", JSON.stringify(data, null, 2)); // DEBUG LOG

            // Handle nested data structure from Weather Agent API
            if (data.data && data.data.response) {
                return data.data.response;
            }

            // Fallback for other formats
            return data.text || data.response || data.message || JSON.stringify(data);
        } else {
            return await response.text();
        }

    } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
    }
}
