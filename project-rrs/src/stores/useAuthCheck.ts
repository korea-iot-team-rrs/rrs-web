import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import useAuthStore from "./useAuthStore";

export function useAuthCheck() {
  const location = useLocation();
  const [cookies] = useCookies(["token"]);
  const { isLoggedIn, logout, setIsLoggedIn } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const validateToken = () => {
    const storedToken = localStorage.getItem("token");
    const cookieToken = cookies.token;

    if (!storedToken || !cookieToken) {
      handleInvalidToken();
      return false;
    }

    if (storedToken !== cookieToken) {
      handleInvalidToken();
      return false;
    }

    setIsLoggedIn(true);
    return true;
  };

  const handleInvalidToken = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (isLoading) {
      validateToken();
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
    }
  }, [location.pathname]);

  return { isLoading, isLoggedIn };
}
