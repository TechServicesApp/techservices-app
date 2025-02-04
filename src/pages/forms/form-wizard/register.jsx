import React from "react";
import { Link } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";
import RegForm from "./common/reg-from";
import Social from "./common/social";
import { ToastContainer } from "react-toastify";
import FormWizard from "../forms/form-wizard/Vertical";
// image import
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";
import Illustration from "@/assets/images/auth/ils1.svg";
import Vertical from "./Vertical";
const register = () => {
  const [isDark] = useDarkMode();
  return (
    <div className=" space-y-5">
      <div key='e'>
        <Vertical />
      </div>
    
    </div>
  );
};

export default register;
