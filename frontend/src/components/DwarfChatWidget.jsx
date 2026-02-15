import React, { useState, useRef, useEffect } from 'react';
import { useDwarf } from '../context/DwarfContext';

export default function DwarfChatWidget() {
    const { dwarf, chatOpen, setChatOpen, sendMessage } = useDwarf();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [dwarf.messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (chatOpen) {
            setTimeout(() => inputRef.current?.focus(), 200);
        }
    }, [chatOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!dwarf.hasGreeted) return null; // Don't show until first order

    return (
        <>
            {/* Chat Panel */}
            <div className={`dwarf-chat ${chatOpen ? 'open' : ''}`}>
                {/* Chat Header */}
                <div className="dwarf-chat-header">
                    <div className="dwarf-chat-header-left">
                        <div className="dwarf-avatar-lg">
                            {dwarf.name ? dwarf.avatar : '✦'}
                        </div>
                        <div>
                            <div className="dwarf-chat-name">
                                {dwarf.name || 'Your Dwarf'}
                            </div>
                            <div className="dwarf-chat-status">
                                <span className="dwarf-status-dot" />
                                Online
                            </div>
                        </div>
                    </div>
                    <button className="dwarf-chat-close" onClick={() => setChatOpen(false)}>✕</button>
                </div>

                {/* Messages */}
                <div className="dwarf-chat-messages">
                    {dwarf.messages.map((msg, i) => (
                        <div key={i} className={`dwarf-msg ${msg.from === 'user' ? 'dwarf-msg-user' : 'dwarf-msg-bot'}`}>
                            {msg.from === 'dwarf' && (
                                <div className="dwarf-msg-avatar">
                                    {dwarf.name ? dwarf.avatar : '✦'}
                                </div>
                            )}
                            <div className="dwarf-msg-bubble">
                                <div className="dwarf-msg-text">{msg.text}</div>
                                <div className="dwarf-msg-time">{formatTime(msg.time)}</div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form className="dwarf-chat-input" onSubmit={handleSend}>
                    <input
                        ref={inputRef}
                        type="text"
                        className="dwarf-input"
                        placeholder={dwarf.waitingForName ? "Type a name for me..." : "Type a message..."}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <button type="submit" className="dwarf-send-btn" disabled={!input.trim()}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </form>
            </div>

            {/* Backdrop for mobile */}
            {chatOpen && <div className="dwarf-backdrop" onClick={() => setChatOpen(false)} />}
        </>
    );
}
