"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Bot, User, Volume2, StopCircle } from "lucide-react";

interface MessageBubbleProps {
    role: "user" | "agent";
    content: string;
    timestamp?: string;
}

export function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
    const isUser = role === "user";
    const [displayedContent, setDisplayedContent] = useState(isUser ? content : "");
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Typewriter Effect for Agent
    useEffect(() => {
        if (isUser) {
            setDisplayedContent(content);
            return;
        }

        let i = 0;
        const speed = 15; // ms per char
        const intervalId = setInterval(() => {
            setDisplayedContent(content.slice(0, i + 1));
            i++;
            if (i >= content.length) {
                clearInterval(intervalId);
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [content, isUser]);

    // TTS Handler
    const handleSpeak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            window.speechSynthesis.cancel(); // Stop any other speech
            const utterance = new SpeechSynthesisUtterance(content);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    return (
        <div
            className={cn(
                "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div
                className={cn(
                    "flex flex-col max-w-[80%] md:max-w-[70%]",
                    isUser ? "items-end" : "items-start"
                )}
            >
                <div className={cn("flex items-start", isUser ? "flex-row-reverse" : "flex-row")}>
                    <div
                        className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm mx-2",
                            isUser ? "bg-blue-600 text-white" : "bg-primary text-white"
                        )}
                    >
                        {isUser ? <User size={18} /> : <Bot size={18} />}
                    </div>

                    <div className="flex flex-col">
                        <div
                            className={cn(
                                "p-4 rounded-2xl shadow-sm overflow-hidden text-sm md:text-base leading-relaxed break-words relative",
                                isUser
                                    ? "bg-blue-600 text-white rounded-tr-none"
                                    : "bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-foreground dark:text-gray-100 rounded-tl-none"
                            )}
                        >
                            {isUser ? (
                                <p className="whitespace-pre-wrap">{content}</p>
                            ) : (
                                <div className="markdown-body">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                            ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                                            li: ({ children }) => <li className="mb-1">{children}</li>,
                                            h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                                            h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                                            code: ({ node, inline, className, children, ...props }: any) => {
                                                return !inline ? (
                                                    <div className="bg-gray-800 text-gray-100 p-2 rounded-md my-2 overflow-x-auto text-xs">
                                                        <code className={className} {...props}>{children}</code>
                                                    </div>
                                                ) : (
                                                    <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
                                                )
                                            }
                                        }}
                                    >
                                        {displayedContent}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                        {/* TTS Button for Agent */}
                        {!isUser && (
                            <button
                                onClick={handleSpeak}
                                className="self-start mt-1 ml-1 text-gray-400 hover:text-blue-500 transition-colors"
                                title={isSpeaking ? "Stop Speaking" : "Read Aloud"}
                            >
                                {isSpeaking ? <StopCircle size={14} /> : <Volume2 size={14} />}
                            </button>
                        )}
                    </div>
                </div>
                {timestamp && (
                    <span className={cn(
                        "text-[10px] text-gray-400 mt-1 mx-12",
                        isUser ? "text-right" : "text-left"
                    )}>
                        {timestamp}
                    </span>
                )}
            </div>
        </div>
    );
}
