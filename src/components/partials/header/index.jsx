import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import Icon from "@/components/ui/Icon";
import SwitchDark from "./Tools/SwitchDark";
import Tooltip from "@/components/ui/Tooltip";
import HorizentalMenu from "./Tools/HorizentalMenu";
import useWidth from "@/hooks/useWidth";
import useSidebar from "@/hooks/useSidebar";
import useNavbarType from "@/hooks/useNavbarType";
import useMenulayout from "@/hooks/useMenulayout";
import useSkin from "@/hooks/useSkin";
import Logo from "./Tools/Logo";
import SearchModal from "./Tools/SearchModal";
import Profile from "./Tools/Profile";
import Notification from "./Tools/Notification";
import useRtl from "@/hooks/useRtl";
import useMobileMenu from "@/hooks/useMobileMenu";
import MonoChrome from "./Tools/MonoChrome";
import { auth } from "@/firebaseconfig";
import { toast } from "react-toastify";

const Header = ({ className = "custom-class" }) => {
	const [collapsed, setMenuCollapsed] = useSidebar();
	const { width, breakpoints } = useWidth();
	const [navbarType] = useNavbarType();
	const navigate = useNavigate(); // Ajout de la navigation
	const navbarTypeClass = () => {
		switch (navbarType) {
			case "floating":
				return "floating  has-sticky-header";
			case "sticky":
				return "sticky top-0 z-[999]";
			case "static":
				return "static";
			case "hidden":
				return "hidden";
			default:
				return "sticky top-0";
		}
	};
	const [menuType] = useMenulayout();
	const [skin] = useSkin();
	const [isRtl] = useRtl();
	const [mobileMenu, setMobileMenu] = useMobileMenu();
	const [refreshNotifications, setRefreshNotifications] = useState(false);

	const refreshAfterDelay = () => {
		setTimeout(() => {
			setRefreshNotifications((prevState) => !prevState);
		}, 50000);
	};

	useEffect(() => {
		refreshAfterDelay();
	}, []);

	const handleOpenMobileMenu = () => {
		setMobileMenu(!mobileMenu);
	};

	const borderSwicthClass = () => {
		if (skin === "bordered" && navbarType !== "floating") {
			return "border-b border-slate-200 dark:border-slate-700";
		} else if (skin === "bordered" && navbarType === "floating") {
			return "border border-slate-200 dark:border-slate-700";
		} else {
			return "dark:border-b dark:border-slate-700 dark:border-opacity-60";
		}
	};

	// Fonction de déconnexion
	const handleLogout = async () => {
		try {
		await signOut(auth); // Déconnexion Firebase
		toast.success("Déconnecté avec succès"); // Affichage du toast
		
		// Attendre que le toast soit visible (par exemple, 2 secondes)
		setTimeout(() => {
			navigate("/"); // Redirection vers la page d'accueil
		}, 2000); // Délai de 2 secondes
	} catch (error) {
		console.error("Erreur lors de la déconnexion :", error);
		toast.error("Erreur lors de la déconnexion");
	}

	};

	return (
		<header className={className + " " + navbarTypeClass()}>
			<div
				className={`app-header md:px-6 px-[15px] dark:bg-slate-800 shadow-base dark:shadow-base3 bg-white
					${borderSwicthClass()}
					${menuType === "horizontal" && width > breakpoints.xl ? "py-1" : "md:py-6 py-3"}
				`}
			>
				<div className="flex justify-between items-center h-full">
					{/* For Vertical */}
					{menuType === "vertical" && (
						<div className="flex items-center md:space-x-4 space-x-2 rtl:space-x-reverse">
							{collapsed && width >= breakpoints.xl && (
								<button
									className="text-xl text-slate-900 dark:text-white"
									onClick={() => setMenuCollapsed(!collapsed)}
								>
									{isRtl ? (
										<Icon icon="akar-icons:arrow-left" />
									) : (
										<Icon icon="akar-icons:arrow-right" />
									)}
								</button>
							)}
							{width < breakpoints.xl && <Logo />}
							{/* open mobile menu handler */}
							{width < breakpoints.xl && width >= breakpoints.md && (
								<div
									className="cursor-pointer text-slate-900 dark:text-white text-2xl"
									onClick={handleOpenMobileMenu}
								>
									<Icon icon="heroicons-outline:menu-alt-3" />
								</div>
							)}
							<SearchModal />
						</div>
					)}
					{/* For Horizontal */}
					{menuType === "horizontal" && (
						<div className="flex items-center space-x-4 rtl:space-x-reverse">
							<Logo />
							{/* open mobile menu handler */}
							{console.log("Menu icon rendered")}
							
							{width <= breakpoints.xl && (
								<div
									className="cursor-pointer text-slate-900 dark:text-white text-2xl"
									onClick={handleOpenMobileMenu}
								>
									<Icon icon="heroicons-outline:menu-alt-3" />
								</div>
							)}
						</div>
					)}
					{/* Horizontal Main Menu */}
					{menuType === "horizontal" && width >= breakpoints.xl ? (
						<HorizentalMenu />
					) : null}
					{/* Nav Tools */}
					<div className="nav-tools flex items-center lg:space-x-6 space-x-3 rtl:space-x-reverse">
					
						<SwitchDark />
						<MonoChrome />
						{width >= breakpoints.md && (
							<Notification key={refreshNotifications.toString()} />
						)}
						 <Tooltip
              content="Se deconnecter"
              placement="top"
              arrow
              animation="shift-away"
            >
						<button
							onClick={handleLogout}
						className="lg:h-[32px] lg:w-[32px] lg:bg-slate-100 lg:dark:bg-slate-900 dark:text-white text-slate-900 cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center"
						>
							<Icon icon="simple-line-icons:logout"   />
						</button>
						</Tooltip>
						{width >= breakpoints.md && <Profile />}
						{width <= breakpoints.md && (
              <div
                className="cursor-pointer text-slate-900 dark:text-white text-2xl"
                onClick={handleOpenMobileMenu}
              >
                <Icon icon="heroicons-outline:menu-alt-3" />
              </div>
            )}
						{/* Bouton de déconnexion */}
						
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
