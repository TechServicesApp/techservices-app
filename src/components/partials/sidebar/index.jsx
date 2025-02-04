import React, { useRef, useEffect, useState } from "react";
import SidebarLogo from "./Logo";
import Navmenu from "./Navmenu";
import { menuItems } from "@/constant/data";
import SimpleBar from "simplebar-react";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";
import { auth, db} from "@/firebaseconfig";
import {
  collection,
  getCountFromServer,
} from "firebase/firestore";
import {  where, query } from "firebase/firestore";

const Sidebar = () => {
  const scrollableNodeRef = useRef();
  const [scroll, setScroll] = useState(false);
  const [refreshNotifications, setRefreshNotifications] = useState(false);
 
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

    return () => clearInterval(fetchDataInterval); // Cleanup on unmount
  }, []);

  const [collapsed, setMenuCollapsed] = useSidebar();
  const [menuHover, setMenuHover] = useState(false);

  // semi dark option
  const [isSemiDark] = useSemiDark();
  // skin
  const [skin] = useSkin();

  return (
    <div
      key={refreshNotifications.toString()}
      className={isSemiDark ? "dark" : ""}
    >
      <div
        className={`sidebar-wrapper bg-white dark:bg-slate-800     ${
          collapsed ? "w-[72px] close_sidebar" : "w-[248px]"
        }
      ${menuHover ? "sidebar-hovered" : ""}
      ${
        skin === "bordered"
          ? "border-r border-slate-200 dark:border-slate-700"
          : "shadow-base"
      }
      `}
        onMouseEnter={() => {
          setMenuHover(true);
        }}
        onMouseLeave={() => {
          setMenuHover(false);
        }}
      >
        <SidebarLogo menuHover={menuHover} />
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
          {/* {!collapsed && ( */}
          {/* <div className="bg-slate-900 mb-16 mt-24 p-4 relative text-center rounded-2xl text-white"> */}
            {/* <img */}
            {/* src={svgRabitImage} */}
            {/* alt="" */}
            {/* className="mx-auto relative -mt-[73px]" */}
            {/* /> */}

            {/* <div className="mt-6"> */}
            {/* <button className="btn bg-white hover:bg-opacity-80 text-slate-900 btn-sm w-full block"> */}
            {/* Upgrade */}
            {/* </button> */}
            {/* </div> */}
          {/* </div> */}
          {/* )} */}
        </SimpleBar>
      </div>
    </div>
  );
};

export default Sidebar;
