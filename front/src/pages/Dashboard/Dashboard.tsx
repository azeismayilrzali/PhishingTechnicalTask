import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import Notification from "../../components/Notification";
import {
  getPhishingAttempts,
  sendPhishingEmail,
} from "../../services/phishingService";
import { PhishingAttempt } from "../../types/types";
import { io, Socket } from "socket.io-client";

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [attempts, setAttempts] = useState<PhishingAttempt[]>([]);
  const [email, setEmail] = useState<string>("");
  const [templateId, setTemplateId] = useState<string>("");
  const [notification, setNotification] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(
      process.env.REACT_APP_API_URL || "http://localhost:3001"
    );
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("phishing-status-changed", (updatedAttempt) => {
      setAttempts((prevAttempts) => {
        const updatedAttempts = prevAttempts.map((attempt) =>
          attempt.trackingId === updatedAttempt.trackingId
            ? {
                ...attempt,
                status: updatedAttempt.status,
                clickedAt: updatedAttempt.clickedAt,
              }
            : attempt
        );

        if (updatedAttempt.status === "clicked") {
          setNotification(`Phishing link clicked by ${updatedAttempt.email}`);
        }

        return updatedAttempts;
      });
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    return () => {
      socket.off("phishing-status-changed");
      socket.off("connect_error");
    };
  }, [socket]);

  // Fetch phishing attempts from the backend
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const data = await getPhishingAttempts(token);
          setAttempts(data);
        }
      } catch (error) {
        console.error("Failed to fetch phishing attempts:", error);
        setNotification("Error fetching phishing attempts.");
      }
    };

    fetchAttempts();
  }, []);

  // Handle sending phishing email
  const handleSendMail = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (token && email && templateId) {
        const response = await sendPhishingEmail(token, email, templateId);
        setNotification(`Phishing message sent to ${email}`);

        if (response && response.trackingId) {
          setAttempts((prevAttempts) => [
            ...prevAttempts,
            {
              _id: response._id,
              email,
              templateId,
              status: "sent",
              trackingId: response.trackingId,
              createdAt: response.createdAt,
              updatedAt: response.updatedAt,
              __v: response.__v,
            },
          ]);
        } else {
          setAttempts((prevAttempts) => [
            ...prevAttempts,
            {
              _id: response._id,
              email,
              templateId,
              status: "sent",
              trackingId: response.trackingId,
              createdAt: response.createdAt,
              updatedAt: response.updatedAt,
              __v: response.__v,
            },
          ]);
        }

        setEmail("");
        setTemplateId("");
      } else {
        setNotification("Please fill in both fields.");
      }
    } catch (error) {
      console.error("Failed to send phishing message:", error);
      setNotification("Failed to send phishing message");
    }
  };

  // Close the notification
  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardBox}>
        <h2>Phishing Attempts</h2>

        <form onSubmit={handleSendMail} className={styles.inputContainer}>
          <input
            type="email"
            required
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            name="templateId"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className={styles.dropdown}
          >
            <option value="">Select content</option>
            <option value="account-verification">Account Verification</option>
            <option value="password-reset">Password Reset</option>
          </select>

          <button type="submit" className={styles.sendButton}>
            Send
          </button>
        </form>

        {notification && (
          <Notification
            message={notification}
            onClose={handleCloseNotification}
          />
        )}

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt._id || `${attempt.email}-${Date.now()}`}>
                <td>{attempt.email}</td>
                <td
                  className={
                    attempt.status === "clicked"
                      ? styles.statusClicked
                      : attempt.status === "sent"
                      ? styles.statusNotClicked
                      : styles.statusFailed
                  }
                >
                  {attempt.status}
                </td>
                <td>{attempt.templateId}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            onLogout();
          }}
          className={styles.logoutButton}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
