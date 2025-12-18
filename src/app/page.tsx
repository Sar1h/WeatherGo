"use client";

import { ChatInterface } from "@/components/ui/ChatInterface";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-5xl">
        <ChatInterface />
      </div>
    </main>
  );
}
