import React, { useState, useEffect } from "react";
import socket from "../socket";

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Listen for messages broadcasted from the server.
        socket.on("receiveMessage", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Clean up the listener on component unmount.
        return () => {
            socket.off("receiveMessage");
        };
    }, []);

    const handleSend = () => {
        if (message.trim() !== "") {
            const messageData = {
                content: message,
                timestamp: Date.now(),
                // Additional fields such as sender info can be added here.
            };
            // Emit the message to the server.
            socket.emit("sendMessage", messageData);
            setMessage("");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Chat Room</h2>
            <div
                style={{
                    border: "1px solid #ccc",
                    height: "300px",
                    overflowY: "auto",
                    padding: "10px",
                    marginBottom: "10px",
                }}
            >
                {messages.map((msg, index) => (
                    <div key={index} style={{ marginBottom: "5px" }}>
                        <span style={{ fontSize: "12px", color: "#888" }}>
                            {new Date(msg.timestamp).toLocaleTimeString()}:
                        </span>{" "}
                        <span>{msg.content}</span>
                    </div>
                ))}
            </div>
            <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ width: "80%", padding: "8px" }}
            />
            <button onClick={handleSend} style={{ padding: "8px 12px", marginLeft: "10px" }}>
                Send
            </button>
        </div>
    );
};

export default Chat;