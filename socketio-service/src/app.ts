import express from "express";
import cors from "cors";
import { io } from "./socket/socket.js";

const app = express();

/**
 * TRUST PROXY
 */
app.set("trust proxy", 1);

/**
 * INTERNAL CORS
 */
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://hostahospital.com",
        ],
        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "PATCH",
            "OPTIONS",
        ],
        credentials: true,
    })
);

/**
 * BODY PARSER
 */
app.use(express.json({ limit: "10mb" }));
app.use(
    express.urlencoded({
        limit: "10mb",
        extended: true,
    })
);

// ==============================================
// ADD THIS ENDPOINT FOR EMITTING EVENTS
// ==============================================
app.post("/emit-event", (req, res) => {
    try {
        const { event, userId, data } = req.body;


        console.log(req.body, "hlelooo");
    

        if (!io) {
            return res.status(503).json({
                success: false,
                message: "Socket server not initialized yet"
            });
        }

        // Emit to specific room if provided
        if (userId) {
            io.to(userId).emit(event, data);
        } else {
            // Broadcast to all connected clients
            io.emit(event, data);
        }

         console.log("ok");

        return res.status(200).json({
            success: true,
            message: `Event '${event}' emitted successfully`,
            emittedTo: userId || 'all clients'
        });


       

    } catch (error) {
        console.error('❌ Error emitting event:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to emit event",
            error: process.env.NODE_ENV === "development" ? error : undefined
        });
    }
});

/**
 * HEALTH
 */
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        service: "socket-service",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
    });
});

/**
 * SOCKET TEST
 */
app.get("/test", (req, res) => {
    if (io) {
        io.emit("test-event", {
            message: "Socket working",
        });
        return res.status(200).json({
            success: true,
            message: "Socket event emitted successfully",
        });
    }
    return res.status(503).json({
        success: false,
        message: "Socket server not initialized yet",
    });
});

/**
 * 404
 */
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: "Requested socket-related resource not found",
    });
});

/**
 * GLOBAL ERROR HANDLER
 */
app.use((err: any, req: any, res: any, next: any) => {
    console.error("Socket Service Error:", {
        message: err.message,
        stack: err.stack,
    });

    res.status(err.status || 500).json({
        success: false,
        message: "Internal Server Error in Socket Service",
        error: process.env.NODE_ENV === "development" ? err : {},
    });
});

export default app;
