"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, CloudRain, Trash2, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageBubble } from "./MessageBubble";
import { LoadingIndicator } from "./LoadingIndicator";
import { sendMessageToAgent, ChatMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

// Add type definition for Web Speech API
declare global {
    interface Window {
        webkitSpeechRecognition: any;
    }
}

export function ChatInterface() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const startListening = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Voice input is not supported in this browser completely.");
            return;
        }

        if (!recognitionRef.current) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = "en-US";

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(transcript);
                // Optional: Auto-send could be enabled here, but letting user review is safer
                inputRef.current?.focus();
            };
            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };
            recognitionRef.current = recognition;
        }

        recognitionRef.current.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMessage: ChatMessage = { role: "user", content: inputValue.trim(), timestamp };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const responseText = await sendMessageToAgent(userMessage.content);
            const agentTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const agentMessage: ChatMessage = { role: "agent", content: responseText, timestamp: agentTimestamp };
            setMessages((prev) => [...prev, agentMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = {
                role: "agent",
                content: "⚠️ I'm sorry, I encountered an error connecting to the weather service. Please try again."
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            // Keep focus on input for better UX
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearChat = () => {
        if (confirm("Are you sure you want to clear the conversation?")) {
            setMessages([]);
        }
    };

    return (
        <div className="flex flex-col h-[85vh] max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-primary p-4 md:p-6 flex items-center justify-between shadow-md z-10">
                <div className="flex items-center space-x-3">
                    <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                        <CloudRain className="text-blue-300 w-6 h-6 md:w-8 md:h-8" />
                    </div>
                    <div>
                        <div>
                            <h1 className="text-white font-bold text-lg md:text-xl tracking-tight">WeatherGo</h1>
                            <p className="text-blue-200 text-xs md:text-sm flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                                Online Status
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={clearChat}
                    className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                    title="Clear Chat"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 relative scroll-smooth">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
                        <div className="bg-blue-50 p-6 rounded-full mb-4">
                            <CloudRain className="w-16 h-16 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">How can I help you today?</h3>
                        <p className="text-gray-500 max-w-sm">
                            Ask me about the weather in any city, forecast details, or climate questions.
                        </p>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
                            {["Weather in London?", "Will it rain in Mumbai?", "Temperature in New York", "Forecast for Tokyo"].map((q) => (
                                <button
                                    key={q}
                                    onClick={() => setInputValue(q)}
                                    className="bg-white border border-gray-200 p-3 rounded-xl text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all text-left shadow-sm hover:shadow-md"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 pb-4">
                        {messages.map((msg, index) => (
                            <MessageBubble key={index} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
                        ))}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-start"
                            >
                                <LoadingIndicator />
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className={cn(
                    "relative flex items-center bg-gray-50 transition-colors rounded-2xl border border-gray-200 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20",
                    isListening && "border-red-400 ring-2 ring-red-100" // Visual feedback for listening
                )}>
                    <button
                        onClick={handleMicClick}
                        className={cn(
                            "p-3 rounded-xl ml-2 transition-all duration-200 hover:bg-gray-200",
                            isListening ? "text-red-500 animate-pulse bg-red-50 hover:bg-red-100" : "text-gray-400"
                        )}
                        title={isListening ? "Stop Listening" : "Voice Input"}
                    >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>

                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isListening ? "Listening..." : "Ask about the weather..."}
                        className="flex-1 bg-transparent px-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className={cn(
                            "p-3 rounded-xl mr-2 transition-all duration-200",
                            inputValue.trim() && !isLoading
                                ? "bg-accent text-white shadow-lg hover:bg-blue-600 transform hover:scale-105"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        )}
                    >
                        <Send size={20} />
                    </button>
                </div>
                <p className="text-center text-[10px] text-gray-400 mt-2">
                    Powered by Provue AI • Roll No: 2023201002
                </p>
            </div>
        </div>
    );
}
