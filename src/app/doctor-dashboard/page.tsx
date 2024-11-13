"use client";

import React, { useEffect } from "react";
import { preLoaderAnim } from "@/utils/animation";
import "../../utils/preloader.css";

const DoctorDashboardPage = () => {
  useEffect(() => {
    preLoaderAnim();
  }, []);
  return (
    <div className="preloader">
      <div className="texts-container">
        <span>Bienvenido a AlivIA, </span>
        <span>Dr. Josue Cordova</span>
        <span>Gracias por elejir trabajar con nosotros</span>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
