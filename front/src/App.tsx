import { useState } from "react";
import { AuthPage } from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  return isAuthenticated ? (
    <Dashboard onLogout={() => setIsAuthenticated(false)} />
  ) : (
    <AuthPage onLogin={() => setIsAuthenticated(true)} />
  );
};

export default App;
