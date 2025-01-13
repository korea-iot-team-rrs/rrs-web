import React, { useEffect, useState } from 'react'
import { AntSwitch } from "../../../styles/dangSitter/DangSitterCommon";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const ProviderUdpate = () => {
  const [isActive, setIsActive] = useState(false);
  const [role, setRole] = useState();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }

    const fetchRole = () => {
      try {
        const response = await axios.get(`http://localhost:4040/api/v1/role`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        setRole(response.data.role);
        setIsActive(response.data.role === "")
      }
    }

  return (
    <div>
      <div>
        <AntSwitch />
      </div>
    </div>
  )
}


export default ProviderUdpate;
