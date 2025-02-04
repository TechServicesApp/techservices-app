import React, { useEffect, Suspense,useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/partials/header";
import Sidebar from "@/components/partials/sidebar";
import Sidebarentreprise from "@/components/partials/sidebar/indexentreprise";
import Sidebarbureauetude from "@/components/partials/sidebar/indexbureau";
import Sidebararchitecture from "@/components/partials/sidebar/indexarchitecture";
import Settings from "@/components/partials/settings";
import useWidth from "@/hooks/useWidth";
import useSidebar from "@/hooks/useSidebar";
import useContentWidth from "@/hooks/useContentWidth"
import MobileMenu from "@/components/partials/sidebar/MobileMenu";
import useMenulayout from "@/hooks/useMenulayout";
import useMenuHidden from "@/hooks/useMenuHidden";
import MobileMenuentreprise from "../components/partials/sidebar/Mobilearchitecture";
import MobileMenuarchitecture from "../components/partials/sidebar/Mobileentreprise";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Footer from "@/components/partials/footer";
import MobileMenubureau from "@/components/partials/sidebar/Mobilebureau";
import useMobileMenu from "@/hooks/useMobileMenu";
import MobileFooter from "@/components/partials/footer/MobileFooter";
import { ToastContainer } from "react-toastify";
import Loading from "@/components/Loading";
import { motion } from "framer-motion";
const Layout = () => {
  const { width, breakpoints } = useWidth();
  const [collapsed] = useSidebar();
 
  
  
  useEffect(() => {
  }, []);

 
  
  const switchHeaderClass = () => {
    if (menuType === "horizontal" || menuHidden) {
      return "ltr:ml-0 rtl:mr-0";
    } else if (collapsed) {
      return "ltr:ml-[72px] rtl:mr-[72px]";
    } else {
      return "ltr:ml-[248px] rtl:mr-[248px]";
    }
  };
  // content width
  const [contentWidth] = useContentWidth();
  const [menuType] = useMenulayout();
  const [menuHidden] = useMenuHidden();
  const [refreshNotifications, setRefreshNotifications] = useState(false);
  // mobile menu
  const [mobileMenu, setMobileMenu] = useMobileMenu();
  

  return (
    
    <>
    <div translate="no">
      <ToastContainer />
      <Header className={width > breakpoints.xl ? switchHeaderClass() : ""} />
        {/* *******************Menu non responsive************************ */}
      {menuType === "vertical" && width > breakpoints.xl && !menuHidden && (
  localStorage.getItem("idservice") === "uX2Xg5nHLJTz8JsEAWiz" ? (
    <Sidebar key={refreshNotifications.toString()} />
  ) : localStorage.getItem("idservice") === "dlJINMSa04nPdbhH56Oy" ? (
    <Sidebarentreprise />
  ) :  localStorage.getItem("idservice") === "5rUVXFsgMNr2lTQebSKa" ? (
    <Sidebarbureauetude/>
  ) : <Sidebararchitecture/>
)}

{/*************** ****************** Menu en responsive***************************** */}
   {localStorage.getItem("idservice")==="uX2Xg5nHLJTz8JsEAWiz" &&   <MobileMenu
        className={`${
          width < breakpoints.xl && mobileMenu
            ? "left-0 visible opacity-100  z-[9999]"
            : "left-[-300px] invisible opacity-0  z-[-999] "
        }`}
      />
   }
    {localStorage.getItem("idservice")==="5rUVXFsgMNr2lTQebSKa" &&   <MobileMenubureau
        className={`${
          width < breakpoints.xl && mobileMenu
            ? "left-0 visible opacity-100  z-[9999]"
            : "left-[-300px] invisible opacity-0  z-[-999] "
        }`}
      />
   }
    {localStorage.getItem("idservice")==="dlJINMSa04nPdbhH56Oy" &&   <MobileMenuentreprise
        className={`${
          width < breakpoints.xl && mobileMenu
            ? "left-0 visible opacity-100  z-[9999]"
            : "left-[-300px] invisible opacity-0  z-[-999] "
        }`}
      />
   } 
    {localStorage.getItem("idservice")==="21xHEmO1HQC4Hst4QNup" &&   <MobileMenuarchitecture
        className={`${
          width < breakpoints.xl && mobileMenu
            ? "left-0 visible opacity-100  z-[9999]"
            : "left-[-300px] invisible opacity-0  z-[-999] "
        }`}
      />
   } 
      {/* mobile menu overlay*/}
      {width < breakpoints.xl && mobileMenu && (
        <div
          className="overlay bg-slate-900/50 backdrop-filter backdrop-blur-sm opacity-100 fixed inset-0 z-[999]"
          onClick={() => setMobileMenu(false)}
        ></div>
      )}
      <Settings />
      <div
        className={`content-wrapper transition-all duration-150 ${
          width > 1280 ? switchHeaderClass() : ""
        }`}
      >
        {/* md:min-h-screen will h-full*/}
        <div className="page-content   page-min-height  ">
          <div
            className={
              contentWidth === "boxed" ? "container mx-auto" : "container-fluid"
            }
          >
            <Suspense fallback={<Loading />}>
              <motion.div
                key={location.pathname}
                initial="pageInitial"
                animate="pageAnimate"
                exit="pageExit"
                variants={{
                  pageInitial: {
                    opacity: 0,
                    y: 50,
                  },
                  pageAnimate: {
                    opacity: 1,
                    y: 0,
                  },
                  pageExit: {
                    opacity: 0,
                    y: -50,
                  },
                }}
                transition={{
                  type: "tween",
                  ease: "easeInOut",
                  duration: 0.5,
                }}
              >
                <Breadcrumbs /> 
                {<Outlet />}
              </motion.div>
            </Suspense>
          </div>
        </div>
      </div>
      {width < breakpoints.md && <MobileFooter  key={refreshNotifications.toString()}/>}
      {width > breakpoints.md && (
        <Footer className={width > breakpoints.xl ? switchHeaderClass() : ""} />
      )}
      </div>
    </>
  );
};

export default Layout;
