import axios from "axios";

const API_URL_GET = "http://localhost:3000/api/v1/phishing";
const PHISHING_URL_POST = "http://localhost:3001/phishing/send";

export const getPhishingAttempts = async (token: string) => {
  const response = await axios.get(API_URL_GET, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return response.data;
};

export const sendPhishingEmail = async (token: string, email: string, templateId: string) => {
  const response = await axios.post(PHISHING_URL_POST, {
    email: email,
    templateId: templateId,
  }, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return response.data;
};
