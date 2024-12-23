import React from "react";
import MainLayout from "../../layouts/MainLayout/MainLayout";
import { Route, Routes } from "react-router-dom";
import Announcement from "../Announcement";

export default function Main() {
   return (
      <>
      <MainLayout>
         <Routes>
            <Route path="/" element={<h1>RRS HOMEPAGE</h1>} />
            <Route path="/announcements" element={<Announcement />} />
         </Routes>
      </MainLayout>
      </>
   );
}
