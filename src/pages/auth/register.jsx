import React from "react";
import { Link } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";
import Vertical from "./Vertical";
import Register3 from "./Register3"
import Register2 from "./Register2"
import Register4 from "./Register4"
import Logo from "@/assets/images/logo/logobleu.png";
import Illustration from "@/assets/images/logo/256.png";
const Register = () => {
  const [isDark] = useDarkMode();


  //la page d'inscription
  return (
    <div className="loginwrapper">
         <div className="lg-inner-column">
        <div className="left-column relative z-[1]">
      <div className="flex-1 relative">
        <img
          src={Illustration}
          alt="Illustration"
          className="object-cover h-full w-full"
        />
        <div className="absolute top-4 left-4">
          <img
            src={Logo}
            alt="Logo"
            className="mb-10"
            style={{
              width: "50%",
              height: "auto",
              display: "block",
              marginTop:"18%",
              marginLeft:"25%"
            }}
          />
        </div>
      </div>
      </div>
      <div  style={{ height:100+'vh' }} className="flex-1 flex flex-col justify-center items-center bg-white dark:bg-slate-800">
        <div style={{overflowY:'scroll',marginTop:50+"px"}} className="inner-content w-full  " >
          <div className="mobile-logo text-center mb-6 lg:hidden block">
            <Link to="/">
              <img
                src={ Logo}
                alt=""
                className="mx-auto"
                style={{ width: "40%", height: "auto", marginTop:"10px"}}
              />
            </Link>
          </div>
          <div className="text-center mb-8">
            <h5 className="font-medium text-2xl">S'inscrire</h5>
          </div>
          {/* le formulaire d'inscription */}
          {localStorage.getItem("idservice") === "uX2Xg5nHLJTz8JsEAWiz" &&   <Vertical/>}
          { localStorage.getItem("idservice") === "dlJINMSa04nPdbhH56Oy" && <Register3/>}
          { localStorage.getItem("idservice") === "21xHEmO1HQC4Hst4QNup" && <Register2/>}
          { localStorage.getItem("idservice") === "5rUVXFsgMNr2lTQebSKa" && <Register4/>}
          <div className="max-w-[215px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-6 mb-6 uppercase text-sm text-center">
            Déjà inscrit?
            <Link
              to="/login"
              className="text-slate-900 dark:text-white font-medium hover:underline ml-1"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Register;
