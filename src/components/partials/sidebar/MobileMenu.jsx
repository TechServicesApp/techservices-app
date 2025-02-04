import React, { useRef, useEffect, useState } from "react";
import {
  collection,
  getCountFromServer,
} from "firebase/firestore";
import { auth, db } from "@/firebaseconfig";
import {  where, query } from "firebase/firestore";
import Navmenu from "./Navmenu";
import { menuItems } from "@/constant/data";
import SimpleBar from "simplebar-react";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";
import useDarkMode from "@/hooks/useDarkMode";
import { Link } from "react-router-dom";
import useMobileMenu from "@/hooks/useMobileMenu";
import Icon from "@/components/ui/Icon";
// import images
import MobileLogo from "@/assets/images/logo/logolong.png";
import MobileLogoWhite from "@/assets/images/logo/logolong.png";


const MobileMenu = ({ className = "custom-class" }) => {
  const scrollableNodeRef = useRef();
  const [scroll, setScroll] = useState(false);

  const recuperer = async () => {

    const notifBon = query(
      collection(db, "notificationQuincaillerie"),
      where("quincailleruid", "==", auth.currentUser.uid),
      where("etat", "==", false),
      where("type", "==", "bonCmde")
    );

    const snapshot1 = await getCountFromServer(notifBon);
    const count1 = snapshot1.data().count;
    
    if (count1 > 0) {
      menuItems[1].etatvu = count1;
      menuItems[1].etatnotif = 6;
    } else {
      menuItems[1].etatvu = 0;
      menuItems[1].etatnotif = 6;
    }

    const states = [1, 3, 4, 5];

    for (const state of states) {
      const notificationQuery = query(
        collection(db, "notificationQuincaillerie"),
        where("quincailleruid", "==", auth.currentUser.uid),
        where("etat", "==", false),
        where("etatdevis", "==", state)
      );

      const snapshot = await getCountFromServer(notificationQuery);
      const count = snapshot.data().count;
      if (count > 0) {
       
        menuItems[2].child.forEach((item) => {
          if (state === 1 && item.childtitle.includes("bon de Paiement")) {
            item.etatvu = count;
            item.etatnotif = 1;
          } 
        });
        menuItems[3].child.forEach((item) => {
          if (state === 3 && item.childtitle.includes("attente")) {
            item.etatvu = count;
            item.etatnotif = 3;
          } else if (state === 4 && item.childtitle.includes("Effectuée")) {
            item.etatvu = count;
            item.etatnotif = 4;
          } 
        });
      } else {
        menuItems[2].child.forEach((item) => {
          if (state === 1 && item.childtitle.includes("bon de Paiement")) {
            item.etatvu = 0;
            item.etatnotif = 1;
          }
        });
        menuItems[3].child.forEach((item) => {
          if (state === 3 && item.childtitle.includes("attente")) {
            item.etatvu = 0;
            item.etatnotif = 1;
          } else if (state === 4 && item.childtitle.includes("Effectuée")) {
            item.etatvu = 0;
            item.etatnotif = 4;
          } 
        });
        
      }
    }

    const stateannonce = [0,2];

    for (const state of stateannonce) {
      const notificationQuery = query(
        collection(db, "notificationQuincaillerie"),
        where("quincailleruid", "==", auth.currentUser.uid),
        where("etat", "==", false),
        where("etatannonce", "==", state)
      );

      const snapshot = await getCountFromServer(notificationQuery);
      const count = snapshot.data().count;
      if (count > 0) {
       
      
        menuItems[4].child.forEach((item) => {
          if (state === 0 && item.childtitle.includes("Refus")) {
            item.etatvu = count;
            item.etatnotif = 0;
            item.type = "annonce"
          } else if (state === 2 && item.childtitle.includes("Accept")) {
            item.etatvu = count;
            item.etatnotif = 2;
            item.type = "annonce"
          } 
        });
      } else {
      
        menuItems[4].child.forEach((item) => {
          if (state === 2 && item.childtitle.includes("Accept")) {
            item.etatvu = 0;
            item.etatnotif = 2;
            item.type = "annonce"
          } else if (state === 0 && item.childtitle.includes("Refu")) {
            item.etatvu = 0;
            item.etatnotif = 0;
            item.type = "annonce"
          } 
        });
        
      }
    }

  
  };
  useEffect(() => {
    const handleScroll = () => {
      if (scrollableNodeRef.current.scrollTop > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    scrollableNodeRef.current.addEventListener("scroll", handleScroll);
    const fetchDataInterval = setInterval(recuperer, 50000); // 5 seconds

    return () => clearInterval(fetchDataInterval); // Cleanup on unmoun
  }, [scrollableNodeRef]);

  const [isSemiDark] = useSemiDark();
  // skin
  const [skin] = useSkin();
  const [isDark] = useDarkMode();
  const [mobileMenu, setMobileMenu] = useMobileMenu();
  return (
    <div
      className={`${className} fixed  top-0 bg-white dark:bg-slate-800 shadow-lg  h-full   w-[248px]`}
    >
      <div className="logo-segment flex justify-between items-center bg-white dark:bg-slate-800 z-[9] h-[85px]  px-4 ">
        <Link to="/crm">
          <div className="flex items-center space-x-4">
            <div className="logo-icon">
              {!isDark && !isSemiDark ? (
                <img src={MobileLogo} alt="" />
              ) : (
                <img src={MobileLogoWhite} alt="" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {/* TechServices */}
              </h1>
            </div>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenu(!mobileMenu)}
          className="cursor-pointer text-slate-900 dark:text-white text-2xl"
        >
          <Icon icon="heroicons:x-mark" />
        </button>
      </div>

      <div
        className={`h-[60px]  absolute top-[80px] nav-shadow z-[1] w-full transition-all duration-200 pointer-events-none ${
          scroll ? " opacity-100" : " opacity-0"
        }`}
      ></div>
      <SimpleBar
        className="sidebar-menu px-4 h-[calc(100%-80px)]"
        scrollableNodeProps={{ ref: scrollableNodeRef }}
      >
        <Navmenu menus={menuItems} />
        {/* <div className="bg-slate-900 mb-24 lg:mb-10 mt-24 p-4 relative text-center rounded-2xl text-white">
          <img
            src={svgRabitImage}
            alt=""
            className="mx-auto relative -mt-[73px]"
          />
          <div className="max-w-[160px] mx-auto mt-6">
            <div className="widget-title">Unlimited Access</div>
            <div className="text-xs font-light">
              Upgrade your system to business plan
            </div>
          </div>
          <div className="mt-6">
            <button className="btn bg-white hover:bg-opacity-80 text-slate-900 btn-sm w-full block">
              Upgrade
            </button>
          </div>
        </div> */}
      </SimpleBar>
    </div>
  );
};

export default MobileMenu;
