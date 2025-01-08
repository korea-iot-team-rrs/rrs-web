import React, { useState, useEffect } from 'react';
import FinduserInfo from '../../../components/Auth/FindUserInfo';
import { useLocation } from 'react-router-dom';

export default function FindUserInfoView() {
  const location = useLocation();

  return (
    <>
      <FinduserInfo/>
    </>
  );
}
