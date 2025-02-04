import React from "react";
import useDarkMode from "@/hooks/useDarkMode";
import useWidth from "@/hooks/useWidth";
import MainLogo from "@/assets/images/logo/logobleu.png";
import LogoWhite from "@/assets/images/logo/logobleu.png";
import MobileLogo from "@/assets/images/logo/logolong.png";
import MobileLogoWhite from "@/assets/images/logo/logolong.png";
const Logo = () => {
  const [isDark] = useDarkMode();
  const { width, breakpoints } = useWidth();

  return (
    <div>
      
        {width >= breakpoints.xl ? (
          <img src={isDark ? LogoWhite : MainLogo} alt="" style={{width:"200px"}}/>
        ) : (
          <img src={isDark ? MobileLogoWhite : MobileLogo} alt="" style={{width:"200px"}} />
        )}
     
    </div>
  );
};

export default Logo;
