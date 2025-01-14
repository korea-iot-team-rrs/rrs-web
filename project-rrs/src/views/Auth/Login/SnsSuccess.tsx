import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SnsSuccess() {
  const [, setCookies] = useCookies(["token"]);

  const [queryParam] = useSearchParams();
  const accessToken = queryParam.get('accessToken');
  const expiration = queryParam.get('expiration');

  const navigator = useNavigate();

  useEffect(() => {
      if (accessToken && expiration) {
        const expires = new Date(Date.now() + Number(expiration));
        console.log(expires);
          setCookies("token", accessToken, {
            path: "/",
            expires,
          });;

          navigator('/main');
      }
      else navigator("/signUp");
  }, [accessToken, expiration, navigator, setCookies]);

  return <></>;
}