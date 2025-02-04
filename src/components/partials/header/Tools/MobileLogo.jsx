import React from "react";
import useDarkMode from "@/hooks/useDarkMode";
import MainLogo from "@/assets/images/logo/logobleu.png";
import LogoWhite from "@/assets/images/logo/logobleu.png";
const MobileLogo = () => {
  const [isDark] = useDarkMode();
  return (
    
      <img src={isDark ? LogoWhite : MainLogo} alt="" style={{width:"200px"}}/>
    
  );
};

export default MobileLogo;
