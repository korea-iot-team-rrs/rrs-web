import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { CustomerSupport } from '../../../types/customerSupport';
import { useCookies } from 'react-cookie';

export default function CustomerSupportDetail() {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  return <>
  <div>
    <p>id</p>
  </div>
  </>
}
