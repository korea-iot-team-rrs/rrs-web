import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Main() {
   const navigate = useNavigate();
   const handleNavigateToTodo = () => {
    navigate('/todo');
  }
   return <>
      <button onClick={handleNavigateToTodo}>
        Todo 이동
      </button>
   </>
}
