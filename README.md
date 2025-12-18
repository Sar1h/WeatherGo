# WeatherGo - Weather Agent Chat Interface

A modern, responsive, and aesthetic chat interface for the Provue AI Weather Agent, built with Next.js 15 and Tailwind CSS.

## 🚀 Features

*   **Modern UI**: Clean "Very Dark Blue" and white theme with glassmorphism effects.
*   **Chat Interface**: Real-time interaction with the weather agent using markdown rendering.
*   **Voice Input** (Bonus): Speech-to-text functionality using the Web Speech API.
*   **Aesthetic Animations**: Smooth transitions and loading states powered by Framer Motion.
*   **Responsive**: Mobile-first design working seamlessly on all devices.
*   **Robust**: Handles API errors and connection issues gracefully.

## 🛠️ Technology Stack

*   **Framework**: Next.js 15 (App Router)
*   **Styling**: Tailwind CSS, Lucide Icons
*   **Animation**: Framer Motion
*   **Markdown**: react-markdown, remark-gfm

## 📦 Setup Instructions

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd weather-app
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Open in Browser**:
    Navigate to [http://localhost:3000](http://localhost:3000).

## 📝 Implementation Details

### Approach
- **Component-Based**: Built reusable components like `MessageBubble`, `LoadingIndicator`, and `ChatInterface`.
- **API Integration**: The `api.ts` utility handles the specific request/response lifecycle, including parsing nested JSON responses from the Mastra Cloud agent.
- **State Management**: React `useState` and `useRef` handle the chat history, auto-scrolling, and voice input states.

### Deviations & Assumptions
- **API Endpoint**: As per specific user instruction, used the `test-agent` endpoint instead of the one in the PDF.
- **Streaming**: Used `stream: false` as requested by the user, receiving the full response at once.
- **Roll Number**: Injected `2023201002` into the request body as `threadId` to meet the assignment requirement.

## 🌟 Bonus Features
- **Voice Input**: Click the microphone icon to speak your query. Visual feedback pulses red when listening.
- **Dynamic Favicon**: The cloud icon matches the brand color uniquely generated via `icon.tsx`.

---
*Built for Provue AI Frontend Assignment.*
