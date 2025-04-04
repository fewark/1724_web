import { Server } from "socket.io";

/**
 * Sets up the Socket.IO server.
 *
 * @param {import("http").Server} httpServer - The HTTP server to attach Socket.IO.
 * @returns {import("socket.io").Server} The Socket.IO server instance.
 */
export function setupSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "*", // Allow all origins during development; adjust for production.
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        // Listen for messages from the client.
        socket.on("sendMessage", (data) => {
            // Optionally, save the message to the database here.
            io.emit("receiveMessage", data);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    return io;
}