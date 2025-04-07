export const register = async (email: string, password: string) => {
    const url = "http://localhost:3000/api/v1/auth/register";
    const payload = { email, password };
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  
    return await response.json();
  };
  
  export const login = async (email: string, password: string) => {
    const url = "http://localhost:3000/api/v1/auth/login";
    const payload = { email, password };
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  
    return await response.json();
  };