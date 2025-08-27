// app.js (App Setup)
import express from "express";
import authRoutes from "./routes/user.routes.mjs";
import cors from "cors";

const app = express();
app.use(
	cors({
		origin: "http://localhost:5173", // Allow this frontend origin
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true, // Allow credentials if needed
	})
);
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", authRoutes);

export { app }; // Export the app for use in index.js
