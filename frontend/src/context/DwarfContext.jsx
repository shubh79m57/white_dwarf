import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DwarfContext = createContext();

const STORAGE_KEY = 'wd_dwarf';

function loadDwarf() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

const defaultState = {
    name: null,       // e.g. "Ray"
    avatar: '✦',      // first letter of name, or ✦ if unnamed
    messages: [],      // { from: 'dwarf'|'user', text: string, time: number }
    hasGreeted: false, // whether the bot has greeted the user
    waitingForName: false,
};

export function DwarfProvider({ children }) {
    const [dwarf, setDwarf] = useState(() => loadDwarf() || { ...defaultState });
    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dwarf));
    }, [dwarf]);

    const addMessage = useCallback((from, text) => {
        setDwarf(prev => ({
            ...prev,
            messages: [...prev.messages, { from, text, time: Date.now() }],
        }));
    }, []);

    const triggerGreeting = useCallback((orderId) => {
        setDwarf(prev => {
            if (prev.hasGreeted && prev.name) {
                // Already named — just send a new order message
                const newMessages = [
                    ...prev.messages,
                    {
                        from: 'dwarf',
                        text: `Great news! I'm handling your new order ${orderId}. I'll keep you updated! 📦`,
                        time: Date.now(),
                    },
                ];
                return { ...prev, messages: newMessages };
            }

            // First time greeting
            const newMessages = [
                ...prev.messages,
                {
                    from: 'dwarf',
                    text: `Hi there! 👋 I'm your Dwarf — I'll be handling your order ${orderId}. Think of me as your personal order assistant!`,
                    time: Date.now(),
                },
                {
                    from: 'dwarf',
                    text: `But first... I need a name! What would you like to call me? 😊`,
                    time: Date.now() + 1,
                },
            ];
            return {
                ...prev,
                messages: newMessages,
                hasGreeted: true,
                waitingForName: true,
            };
        });
        setChatOpen(true);
    }, []);

    const sendMessage = useCallback((text) => {
        if (!text.trim()) return;

        // Add user message
        setDwarf(prev => {
            const userMsg = { from: 'user', text: text.trim(), time: Date.now() };
            let updated = { ...prev, messages: [...prev.messages, userMsg] };

            if (prev.waitingForName) {
                // User is naming the dwarf
                const name = text.trim().split(' ')[0]; // Take first word as name
                const avatar = name[0].toUpperCase();
                const reply = {
                    from: 'dwarf',
                    text: `${name}... I love it! ✨ From now on, I'm ${name}. You can chat with me anytime using my icon in the top bar. I'll keep you updated on your orders!`,
                    time: Date.now() + 1,
                };
                updated = {
                    ...updated,
                    name,
                    avatar,
                    waitingForName: false,
                    messages: [...updated.messages, reply],
                };
            } else {
                // Regular chat — simple bot responses
                const lowerText = text.toLowerCase();
                let reply = '';

                if (lowerText.includes('order') || lowerText.includes('status') || lowerText.includes('track')) {
                    reply = `Your order is being prepared with care! 📦 Estimated delivery is 5-7 business days. I'll notify you when it ships!`;
                } else if (lowerText.includes('return') || lowerText.includes('refund')) {
                    reply = `We have a 30-day return policy, no questions asked! Would you like me to help you start a return?`;
                } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
                    reply = `Hey there! 👋 How can I help you today?`;
                } else if (lowerText.includes('thank')) {
                    reply = `You're welcome! Always happy to help. 😊`;
                } else if (lowerText.includes('name')) {
                    reply = `I'm ${prev.name || 'your Dwarf'}! What can I do for you?`;
                } else if (lowerText.includes('help')) {
                    reply = `I can help with:\n• 📦 Order tracking & status\n• ↩️ Returns & refunds\n• 🚚 Delivery information\n• 💬 General questions\n\nJust ask away!`;
                } else {
                    const responses = [
                        `Got it! Let me look into that for you. 🔍`,
                        `That's a great question! I'll check on that right away.`,
                        `I'm on it! Give me a moment. ⚡`,
                        `Thanks for reaching out! I'll help you with that.`,
                    ];
                    reply = responses[Math.floor(Math.random() * responses.length)];
                }

                const replyMsg = { from: 'dwarf', text: reply, time: Date.now() + 500 };
                updated = { ...updated, messages: [...updated.messages, replyMsg] };
            }

            return updated;
        });
    }, []);

    const resetDwarf = useCallback(() => {
        setDwarf({ ...defaultState });
        setChatOpen(false);
    }, []);

    return (
        <DwarfContext.Provider value={{
            dwarf, chatOpen, setChatOpen,
            triggerGreeting, sendMessage, addMessage, resetDwarf,
        }}>
            {children}
        </DwarfContext.Provider>
    );
}

export function useDwarf() {
    const ctx = useContext(DwarfContext);
    if (!ctx) throw new Error('useDwarf must be used within DwarfProvider');
    return ctx;
}
