import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../../../stores/useAuthStore";

export default function SnsSuccess() {
  const [, setCookies] = useCookies(["token"]);

  const [queryParam] = useSearchParams();
  const accessToken = queryParam.get("accessToken");
  const expiration = queryParam.get("expiration");

  const { snsLogin } = useAuthStore();
  const navigator = useNavigate();

  useEffect(() => {
    if (accessToken && expiration) {
      setCookies("token", accessToken, { path: "/" });
      localStorage.setItem("token", accessToken);

      snsLogin(accessToken);

      navigator("/main");
    } else navigator("/signUp");
  }, [accessToken, expiration, navigator, setCookies]);
  return <></>;
}
