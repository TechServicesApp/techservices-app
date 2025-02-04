import React from "react";
import { Link } from "react-router-dom";
import Social from "./common/social";
import LoginFormEntry from "./common/loginformEntry";
import useDarkMode from "@/hooks/useDarkMode";
// image import
import bgImage from "@/assets/images/logo/p2.jpg";
import LogoWhite from "@/assets/images/logo/logobleu.png";
import Logo from "@/assets/images/logo/logo.svg";

const LoginGroupEntry = () => {
  const [isDark] = useDarkMode();
  return (
    <div
      className="loginwrapper bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="lg-inner-column flex flex-wrap h-full">
        <div className="left-columns lg:w-1/2 w-full flex items-center justify-center">
          <div className="logo-box-3">
            <Link to="/">
              <img src={LogoWhite} alt="" style={{ width: "300px" }} />
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 w-full flex flex-col items-center justify-center">
          <div className="auth-box-3">
            <div className="text-center 2xl:mb-10 mb-5">
              <h4 className="font-medium">Bienvenu sur TechService</h4>
              <div className="text-slate-500 dark:text-slate-400 text-base">
                Choix d'option
              </div>
            </div>
            <LoginFormEntry />
            <div className="relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
              <div className="absolute inline-block bg-white dark:bg-slate-800 dark:text-slate-400 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm text-slate-500 dark:text-slate-400 font-normal">
                {/* Or continue with */}
              </div>
            </div>
            <div className="max-w-[242px] mx-auto mt-8 w-full">
              {/* <Social /> */}
            </div>
            {/* <div className="mx-auto font-normal text-slate-500 dark:text-slate-400 2xl:mt-12 mt-6 uppercase text-sm text-center">
              Already registered?
              <Link
                to="/"
                className="text-slate-900 dark:text-white font-medium hover:underline"
              >
                QUINCAILLERIE
              </Link>
            </div> */}
          </div>
        </div>
        {/* <div className="auth-footer3 text-white py-5 px-5 text-xl w-full">
          Unlock your Project performance
        </div> */}
      </div>
    </div>
  );
};

export default LoginGroupEntry;
