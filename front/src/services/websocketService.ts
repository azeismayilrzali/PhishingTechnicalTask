import { io, Socket } from "socket.io-client";
import { PhishingAttempt } from "../types/types";

class WebSocketService {
  private socket: Socket | null = null;
  private readonly baseUrl: string;

  constructor(
    baseUrl: string = process.env.REACT_APP_API_URL || "http://localhost:3001"
  ) {
    this.baseUrl = baseUrl;
  }

  connect(): void {
    if (!this.socket) {
      this.socket = io(this.baseUrl);

      this.socket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });

      this.socket.on("error", (error) => {
        console.error("WebSocket error:", error);
      });
    }
  }

  subscribeToPhishingStatusChanges(
    callback: (data: PhishingAttempt) => void
  ): () => void {
    if (!this.socket) {
      this.connect();
    }

    if (this.socket) {
      this.socket.on("phishing-status-changed", (data: PhishingAttempt) => {
        console.log("Phishing status changed:", data);
        callback(data);
      });
    }

    return () => {
      if (this.socket) {
        this.socket.off("phishing-status-changed");
      }
    };
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

const websocketService = new WebSocketService();
export default websocketService;
