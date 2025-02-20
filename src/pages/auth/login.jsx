import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import useDarkMode from "@/hooks/useDarkMode";
// image import
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logobleu.png";
import Illustration from "@/assets/images/logo/257.png";

const Login = () => {
  const [isDark] = useDarkMode();
  return (
    <div className="loginwrapper">
      <div className="lg-inner-column">
        <div className="left-column relative z-[1] flex justify-center items-center">
          <div className="absolute inset-0 z-[-1] flex justify-center items-center">
            <img
              src={Illustration}
              alt=""
              className="object-cover h-full w-full"
              style={{ position: "absolute", zIndex: -1 }}
            />
          </div>
          <div className="relative z-[1] flex flex-col items-center">
            <Link to="/" className="flex flex-col justify-center items-center">
              <img
                src={isDark ? LogoWhite : Logo}
                alt=""
                className="mb-10"
                style={{
                  width: "50%",
                  height: "auto",
                  display: "block",
                  marginTop:"18%",
                  marginLeft:"0%"
                }}
              />
            </Link>
          </div>
        </div>
        <div className="right-column relative">
          <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
            <div className="auth-box h-full flex flex-col justify-center">
              <div className="mobile-logo text-center mb-6 lg:hidden block">
                <Link to="/">
                  <img
                    src={isDark ? LogoWhite : Logo}
                    alt=""
                    className="mx-auto"
                  />
                </Link>
              </div>
              <div className=" text-center 2xl:mb-10 mb-4 text-white">
                <h4 className="text-[#067BBF] font-medium ">Se connecter</h4>
                <div className="text-slate-500 text-base">
                  Connectez-vous à votre compte pour commencer à utiliser
                  TechServices
                </div>
              </div>
              <LoginForm />
              <div className="relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                <div className="absolute inline-block bg-white dark:bg-slate-800 dark:text-slate-400 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm text-slate-500 font-normal">
                  {/* /Ou continuer avec */}
                </div>
              </div>
              <div className="max-w-[242px] mx-auto mt-8 w-full">
                {/* <Social /> */}
              </div>
              <div
                className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-12 uppercase text-sm"
                style={{ marginTop: "50px" }}
              >
                Vous n'avez pas de compte ? 
                <div className="flex justify-center ">
                  <Link
                    to="/register"
                    className=" dark:text-white font-medium hover:underline text-center text-[#067BBF]"
                  >
                    INSCRIVEZ-VOUS
                  </Link>
                </div>
              </div>
            </div>
            <div className="auth-footer text-center"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
