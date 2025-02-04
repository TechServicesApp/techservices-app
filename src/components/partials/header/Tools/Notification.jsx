import React, { useState, useEffect } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Link } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { auth } from "@/firebaseconfig";
import { IoNotificationsOutline } from "react-icons/io5";
import { fetchPost } from "@/fonctionnotification";
import { useNavigate } from "react-router-dom";
import { notificationannonce } from "@/pages/EntreprisBTP/fonctions/Fonctionsannonces";
import { handleNotificationClick } from "@/fonctionnotification";
import { notificationbesoin as notifarchi } from "@/pages/Architecture/fonctions/Fonctionbesoin";
import { notificationbesoin as notifbureau } from "@/pages/BureaudEtudeBTP/fonctions/Fonctionbesoin";
import { notificationannonce as notifentreprise } from "@/pages/EntreprisBTP/fonctions/Fonctionsannonces";
import { notificationdate } from "@/pages/EntreprisBTP/fonctions/FonctionCalendrier";
import { notificationentreprisefalse } from "@/pages/EntreprisBTP/fonctions/FonctionNotifications";
const Notification = () => {
	const [notifications, setNotifications] = useState([]);
	const navigate = useNavigate();
	let isFetching = false; 

	const naviguer = () => {
		navigate("/notifications");
	};

	const notifyLabel = () => {
		return (
			<span className="relative lg:h-[32px] lg:w-[32px] lg:bg-slate-100 text-slate-900 lg:dark:bg-slate-900 dark:text-white cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center">
				<Icon icon="heroicons-outline:bell" className="animate-tada" />
				{notifications.length > 0 && (
					<span className="absolute lg:right-0 lg:top-0 -top-2 -right-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]">
						{notifications.length}
					</span>
				)}
			</span>
		);
	};
	useEffect(() => {
		const fetchData = async () => {
			if (isFetching) return; // Vérifiez si une requête est déjà en cours
			isFetching = true; // Activez le verrou
	  
			try {
			  let data;
	  
			  if (localStorage.getItem("idservice") === "uX2Xg5nHLJTz8JsEAWiz") {
				data = await fetchPost();
			  } else {
				await notificationdate({ id: auth.currentUser.uid });
				data = await notificationentreprisefalse();
				if (localStorage.getItem("idservice") === "dlJINMSa04nPdbhH56Oy") {
				  await notifentreprise();
				} else if (
				  localStorage.getItem("idservice") === "21xHEmO1HQC4Hst4QNup"
				) {
				  await notifarchi();
				} else {
				  await notifbureau();
				}
			  }
	  
			  await notificationannonce();
			  setNotifications(data);
			  
			} catch (error) {
			  console.error("Erreur lors du chargement des notifications :", error);
			} finally {
			  isFetching = false; // Libérez le verrou après la fin de la requête
			}
		  };
		// Appel initial de fetchData
		fetchData();

		// Définir un intervalle pour répéter fetchData toutes les 5 secondes
		const interval = setInterval(() => {
			fetchData();
		}, 40000); // 40` secondes en millisecondes

		// Nettoyage de l'intervalle lorsque le composant est démonté ou rechargé
		return () => clearInterval(interval);
	}, []);

	return (
		<Dropdown classMenuItems="md:w-[300px] top-[58px]" label={notifyLabel()}>
			<div className="flex justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-600">
				<div className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-6">
					Notifications
				</div>
				<div className="text-slate-800 dark:text-slate-200 text-xs md:text-right">
					<Link
						to="notifications"
						onClick={() => {
							naviguer();
						}}
						className="underline"
					>
						Voir tout
					</Link>
				</div>
			</div>
			<div className="divide-y divide-slate-100 dark:divide-slate-800">
				{notifications?.map((item, i) => (
					<Menu.Item key={i}>
						{({ active }) => (
							<div
								className={`${
									active
										? "bg-slate-100 dark:bg-slate-700 dark:bg-opacity-70 text-slate-800"
										: "text-slate-600 dark:text-slate-300"
								} block w-full px-4 py-2 text-sm  cursor-pointer`}
								onClick={async () => {
									await handleNotificationClick(item);
									navigate(item.lien);
								}}
							>
								<div className="flex ltr:text-left rtl:text-right">
									<div className="flex-none ltr:mr-3 rtl:ml-3">
										<IoNotificationsOutline size={25} />
									</div>
									<div className="flex-1">
										<div
											className={`${
												active
													? "text-slate-600 dark:text-slate-300"
													: " text-slate-600 dark:text-slate-300"
											} text-sm`}
										>
											{item.titre}
										</div>
										<div
											className={`${
												active
													? "text-slate-500 dark:text-slate-200"
													: " text-slate-600 dark:text-slate-300"
											} text-xs leading-4`}
										>
											{item.message || item.description}
										</div>
									</div>
									{item.unread && (
										<div className="flex-0">
											<span className="h-[10px] w-[10px] bg-danger-500 border border-white dark:border-slate-400 rounded-full inline-block"></span>
										</div>
									)}
								</div>
							</div>
						)}
					</Menu.Item>
				))}
			</div>
		</Dropdown>
	);
};

export default Notification;
