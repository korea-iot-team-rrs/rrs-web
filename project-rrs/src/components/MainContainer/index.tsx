import React from 'react';
import '../../styles/MainContainer.css';
import Notice from './Notice';
import Community from './Community';
import PetDiary from './PetDiary';
import HealthRecord from './HealthRecord';


export default function MainContainer() {
  const today = new Date();
  return (
    <div className="container">
      <div className="topSection">
        <Notice />
        <Community />
        <PetDiary today={today} />
      </div>
      <div className="lowSection">
        <div className="box mainBanner">
          <img
            src="https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Dog"
          />
        </div>
        <HealthRecord />
      </div>
    </div>
  );
}