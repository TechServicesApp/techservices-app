import React, { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import { NavLink } from "react-router-dom";
import { notificationannonce } from "@/pages/EntreprisBTP/fonctions/Fonctionsannonces";
import { fetchPost } from "@/fonctionnotification";
import { auth} from "@/firebaseconfig";
import { notificationbesoin as notifarchi } from "@/pages/Architecture/fonctions/Fonctionbesoin";
import { notificationbesoin as notifbureau } from "@/pages/BureaudEtudeBTP/fonctions/Fonctionbesoin";
import { notificationbesoin as notifentreprise } from "@/pages/EntreprisBTP/fonctions/Fonctionbesoin";
import { notificationdate } from "@/pages/EntreprisBTP/fonctions/FonctionCalendrier";
import { notificationentreprisefalse } from "@/pages/EntreprisBTP/fonctions/FonctionNotifications";
const MobileFooter = () => {
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		// Fonction pour récupérer les notifications
		const fetchData = async () => {
			try {
				let data;

				if (localStorage.getItem("idservice") === "uX2Xg5nHLJTz8JsEAWiz") {
					data = await fetchPost();
         
				} else {
					await notificationdate({ id: auth.currentUser.uid });
					data = await notificationentreprisefalse();
					if (localStorage.getItem("idservice") === "dlJINMSa04nPdbhH56Oy") {
						await notifentreprise();
					} else if (localStorage.getItem("idservice") === "21xHEmO1HQC4Hst4QNup") {
						await notifarchi();
					} else {
						await notifbureau();
					}
				}

				await notificationannonce();
				setNotifications(data);
			} catch (error) {
				console.error("Erreur lors du chargement des notifications :", error);
			}
		};

		// Appel initial
		fetchData();

		// Intervalle pour actualiser les données toutes les 5 secondes
		const interval = setInterval(() => {
			fetchData();
		}, 50000);

		// Nettoyage de l'intervalle
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="bg-white bg-no-repeat custom-dropshadow footer-bg dark:bg-slate-700 flex justify-around items-center backdrop-filter backdrop-blur-[40px] fixed left-0 w-full z-[9999] bottom-0 py-[12px] px-4">
			<NavLink to="notifications">
				{({ isActive }) => (
					<div>
						<span
							className={`relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1 ${
								isActive ? "text-primary-500" : "dark:text-white text-slate-900"
							}`}
						>
							<Icon icon="heroicons-outline:bell" />
							{notifications.length > 0 && (
								<span className="absolute right-[17px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]">
									{notifications.length}
								</span>
							)}
						</span>
						<span
							className={`block text-[11px] ${
								isActive ? "text-primary-500" : "text-slate-600 dark:text-slate-300"
							}`}
						>
							Notifications
						</span>
					</div>
				)}
			</NavLink>
		</div>
	);
};

export default MobileFooter;
