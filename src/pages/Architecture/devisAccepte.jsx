import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { auth, db } from "@/firebaseconfig";
import { notificationdate } from  "@/pages/EntreprisBTP/fonctions/FonctionCalendrier";
import { infoclient } from "@/pages/dashboard/InfoClient";
import ProjectGrid from "./ProjectGrid";
import ProjectList from "./ProjectList";
import GridLoading from "@/components/skeleton/Grid";
import TableLoading from "@/components/skeleton/Table";
import { ToastContainer } from "react-toastify";
import { besoinPortfolio } from "./fonctions/Fonctionbesoin";
import Button from "@/components/ui/Button";
import useWidth from "@/hooks/useWidth";

const ExampleTwo = () => {
	const [Devis, setDevis] = useState([]);

	const [filler, setfiller] = useState("grid");
	const { width, breakpoints } = useWidth();
	const [isLoaded, setIsLoaded] = useState(false);

	const fetchPost = async () => {
		await notificationdate({ id: auth.currentUser.uid });
		const devisData = await besoinPortfolio();

		const promises = devisData.map(async (item) => {
			const devisInfo = await infoclient({
				nomcollection: item.auteurCollection,
				idclient: item.auteurId,
			});
			return {
				...item,
				devisInfo: devisInfo,
			};
		});

		const newDataWithDevis = await Promise.all(promises);

		setDevis(newDataWithDevis);
	};

	useEffect(() => {
		const fetchDataInterval = setInterval(fetchPost, 10000); // 5 seconds

		return () => clearInterval(fetchDataInterval); // Cleanup on unmount
	}, []);

	return (
		<>
			<Card>
				<div>
					<ToastContainer />
					<div className="flex flex-wrap justify-between items-center mb-4">
						<h4 className="font-medium lg:text-2xl text-xl capitalize text-[#067BBF] inline-block ltr:pr-4 rtl:pl-4">
						offre de service acceptee
						</h4>
						<div
							className={`${
								width < breakpoints.md ? "space-x-rb" : ""
							} md:flex md:space-x-4 md:justify-end items-center rtl:space-x-reverse`}
						>
							<Button
								icon="heroicons:list-bullet"
								text="Vue en liste"
								disabled={isLoaded}
								className={`${
									filler === "list"
										? "bg-[#067BBF] dark:bg-slate-700  text-white"
										: " bg-white dark:bg-slate-800 dark:text-slate-300"
								}   h-min text-sm font-normal`}
								iconClass=" text-lg"
								onClick={() => setfiller("list")}
							/>
							<Button
								icon="heroicons-outline:view-grid"
								text="Vue en grille"
								disabled={isLoaded}
								className={`${
									filler === "grid"
										? "bg-[#067BBF] dark:bg-slate-700 text-white"
										: " bg-white dark:bg-slate-800 dark:text-slate-300"
								}   h-min text-sm font-normal`}
								iconClass=" text-lg"
								onClick={() => setfiller("grid")}
							/>
						</div>
					</div>
					{isLoaded && filler === "grid" && (
						<GridLoading count={Devis?.length} />
					)}
					{isLoaded && filler === "list" && (
						<TableLoading count={Devis?.length} />
					)}

					{filler === "grid" && !isLoaded && (
						<div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 ">
							{Devis.map((project, projectIndex) => (
								<div style={{boxShadow:"0px 3px 7px #067BBF"}}>
									{" "}
									<ProjectGrid project={project} key={projectIndex} />
								</div>
							))}
						</div>
					)}
					{filler === "list" && !isLoaded && (
						<div>
							<ProjectList projects={Devis} />
						</div>
					)}
				</div>
			</Card>
		</>
	);
};

export default ExampleTwo;
