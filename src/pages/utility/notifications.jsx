import React, { Fragment, useState, useEffect } from "react";
import { Menu } from "@headlessui/react";
import { auth } from "@/firebaseconfig";
import { useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import { notificationentreprisefalse } from "@/pages/EntreprisBTP/fonctions/FonctionNotifications";
import { handleNotificationClick } from "@/fonctionnotification";

const NotificationPage = () => {
	const [notifications, setNotifications] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchDataInterval = setInterval(fetchPost, 15000); // 5 seconds

		return () => clearInterval(fetchDataInterval); // Cleanup on unmount, [];
	});

	const fetchPost = async () => {
		const notifi = await notificationentreprisefalse();
		setNotifications(notifi);
	};

	return (
		<div>
			<Card bodyClass="p-0">
				<div className="flex justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-600">
					<div className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-6">
						Toutes les notifications
					</div>
				</div>
				<div className="divide-y divide-slate-100 dark:divide-slate-800">
					<Menu as={Fragment}>
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
											<div className="flex-none ltr:mr-3 rtl:ml-3"></div>
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
													{item.message}
												</div>
											</div>
										</div>
									</div>
								)}
							</Menu.Item>
						))}
					</Menu>
				</div>
			</Card>
		</div>
	);
};

export default NotificationPage;
