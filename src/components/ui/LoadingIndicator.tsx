"use client";

import { motion } from "framer-motion";

export function LoadingIndicator() {
    return (
        <div className="flex items-center space-x-2 p-2 rounded-2xl bg-secondary w-fit">
            <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 bg-accent rounded-full"
                        animate={{
                            y: ["0%", "-50%", "0%"],
                        }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.15,
                        }}
                    />
                ))}
            </div>
            <span className="text-xs text-muted-foreground ml-2">Thinking...</span>
        </div>
    );
}
