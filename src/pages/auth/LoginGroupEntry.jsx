import React from "react";
import { Link } from "react-router-dom";
import LoginFormEntry from "./common/loginformEntry";
import useDarkMode from "@/hooks/useDarkMode";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper";
// Images pour le carrousel
import bgImage1 from "@/assets/images/all-img/photo1.jpg"
import bgImage2 from "@/assets/images/all-img/photo2.jpg"

import LogoWhite from "@/assets/images/logo/logobleu.png";

const LoginGroupEntry = () => {
  const [isDark] = useDarkMode();

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Carrousel en arrière-plan */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="absolute inset-0 w-full h-full z-0"
        style={{
          filter: "blur(2px)", // Ajoute un flou léger
          transform: "scale(1.1)", // Évite les bords visibles flous
        }}
      >
       
        <SwiperSlide>
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${bgImage1})`,
            }}
          ></div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${bgImage2})`,
            }}
          ></div>
        </SwiperSlide>
       
      </Swiper>

      {/* Contenu principal (formulaire et logo) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="auth-container bg-white p-8 rounded shadow-lg flex flex-col items-center relative">
          {/* Logo sortant du cadre blanc */}
          <div
            className="absolute -top-1"
            style={{ zIndex: 1 }}
          >
            <Link to="/">
              <img
                src={LogoWhite}
                alt="Logo"
                style={{ width: "150px" }}
                className="mx-auto"
              />
            </Link>
          </div>

          {/* Formulaire centré */}
          <div className="auth-box text-center mt-16">
            <h4 className="font-medium text-gray-800 mb-4">
              Bienvenue sur TechServices
            </h4>
            <div className="text-slate-500 dark:text-slate-400 mb-4">
              Veuillez choisir une option
            </div>
            <LoginFormEntry />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginGroupEntry;
