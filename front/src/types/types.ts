export interface PhishingAttempt {
  _id: string;
  email: string;
  templateId: string;
  status: string;
  trackingId: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  clickedAt?: string;
}

export interface NotificationProps {
  message: string;
  onClose: () => void;
}
