import React, { Fragment, useState } from "react";
import Icon from "@/components/ui/Icon";
import { useParams, useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, imgdb, db } from "@/firebaseconfig";
import { useEffect } from "react";
import { annonceUnique, publierCv } from "./fonctions/Fonctionsannonces";
import { cvRecrutement } from "./fonctions/Fonctionsannonces";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Fileinput from "@/components/ui/Fileinput";
import { v4 } from "uuid";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { tousCommentaire } from "./fonctions/Fonctionscommentaire";
import Textarea from "@/components/ui/Textarea";
import { ajoutSuppri } from "./fonctions/Fonctionslike";
import {
	ajouterCommentaire,
	deleteCommentaire,
} from "./fonctions/Fonctionscommentaire";
import { useForm } from "react-hook-form";

const ProductDetails = () => {
	let { id } = useParams();
	const [data, setdata] = useState([]);
	const [cv, setCv] = useState([]);
	const [commentaire, setCommentaire] = useState([]);
	const [uniquecomm, setuniquecomm] = useState("");
	const [logo, setLogo] = useState("");
	const [cvenvoye, setCvenvoye] = useState(true);
	const [data1, setData1] = useState([]);
	const [selectedFile2, setSelectedFile2] = useState(null);
	const navigate = useNavigate();

	const handleUpload2 = (e) => {
		setSelectedFile2(e.target.files[0]);
		const reflogo = ref(imgdb, `CVs/${new Date().getTime() + v4()}`);
		uploadBytes(reflogo, e.target.files[0]).then((snapshot2) => {
			getDownloadURL(snapshot2.ref).then((url2) => {
				setLogo(url2);
			});
		});
	};

	const {
		register,
		formState: { errors },
	} = useForm({});

	const comm = async () => {
		const commentaire = await tousCommentaire({ idannonce: id });
		setCommentaire(commentaire);
	};

	useEffect(() => {
		const fetch = async () => {
			const data = await annonceUnique({ id: id });
			setdata(data);
			const cv = await cvRecrutement({ annonceid: data.id });
			setCv(cv);

			const doc2 = await getDoc(
				doc(
					db,
					localStorage.getItem("idservice") === "21xHEmO1HQC4Hst4QNup"
						? "Architecture"
						: localStorage.getItem("idservice") === "5rUVXFsgMNr2lTQebSKa"
						? "BureaudEtudeBTP"
						: localStorage.getItem("idservice") === "uX2Xg5nHLJTz8JsEAWiz"
						? "Quincaillerie"
						: "EntrepriseBtp",
					localStorage.getItem("quincailler")
				)
			);

			const data1 = doc2.data();
			console.log(data);
			setData1(data1);
			const besoinFound = cv.some((cvdetail) => {
				cvdetail.technicienUID === auth.currentUser.uid;
			});

			if (!besoinFound) {
				setCvenvoye(false);
			}
		};

		const comm = async () => {
			const commentaire = await tousCommentaire({ idannonce: id });
			setCommentaire(commentaire);
		};
		fetch();
		comm();

		// Appel de la fonction async définie dans useEffect
	}, []); // Ajout de la dépendance "id"

	return (
		<>
			<div className="w-full bg-white dark:bg-slate-800 p-6 rounded-lg">
				<div className="pb-5">
					<div className="flex items-center pb-4">
						<div className="ltr:mr-[10px] rtl:ml-[10px]">
							<div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
								<img
									src={data?.devisInfo?.logo || data?.devisInfo?.picture}
									alt=""
									className="block w-full h-full object-cover rounded-full"
								/>
							</div>
						</div>
						<div className="text-slate-600 dark:text-white text-sm font-normal items-center  text-ellipsis whitespace-nowrap">
							<p className="text-ellipsis whitespace-nowrap w-[85px] block">
								{data?.devisInfo?.nom}
							</p>
							<p className="text-slate-400 text-[12px]">
								{data?.updated_at && data?.updated_at.seconds
									? new Date(
											data?.updated_at.seconds * 1000
									  ).toLocaleDateString()
									: "Date non disponible"}
								, {data?.devisInfo?.localisation || data?.devisInfo?.adresse}
							</p>
						</div>
					</div>

					<br />
					<div className="col-span-12 md:col-span-7 lg:col-span-8 space-y-2 ">
						<div className="space-y-2">
							<h1 className="text-slate-900 pl-4 dark:text-slate-300 text-xl lg:text-2xl font-medium ">
								{data.titre}
							</h1>

							<div className="flex items-center space-x-2 rtl:space-x-reverse">
								<p className="font-normal pl-8 text-sm lg:text-base text-slate-500 dark:text-slate-400 ">
									{data.description}
								</p>
								<p className="font-medium text-sm lg:text-base text-slate-900 dark:text-slate-300 "></p>
							</div>
							<br />
							<div className="flex justify-between items-center pt-2">
								<span className="flex items-center text-slate-900 dark:text-slate-300 font-normal text-xs space-x-1 rtl:space-x-reverse">
									<span></span>
								</span>
							</div>
							<p className="font-normal text-sm lg:text-base text-slate-500 dark:text-slate-400"></p>
						</div>
					</div>
					<div className="  md:space-x-6 md:space-y-0 space-y-4 sm:space-y-4  rtl:space-x-reverse ">
						<div className=" w-full h-[400px] col-span-12 md:col-span-5 lg:col-span-4 space-y-4 ">
							{data.typeFichier === "image" ? (
								<img
									className="h-full w-full object-cover"
									src={data.fichier}
									alt="media"
								/>
							) : (
								<video className="h-full w-full object-cover" controls>
									<source src={data.fichier} />
								</video>
							)}
						</div>
						<br />
					</div>
				</div>
				<div>
					<div className=" rounded p-6">
						<h6 className="flex justify-end text-slate-900 dark:text-slate-300 pb-6 border-t border-gray-300 pt-4 text-lg lg:text-xl">
							<div
								className="flex items-center  space-x-1 cursor-pointer"
								onClick={async () => {
									const post = (data) => {
										const newLikeState = data.like === 1 ? 0 : 1; // Inverser l'état du like
										console.log(data.like);
										return {
											...data,
											like: newLikeState,
											likes:
												newLikeState === 1 ? data.likes + 1 : data.likes - 1,
										};
									};
									const updatedData = post(data); // Assurez-vous que `data` est défini et contient les propriétés nécessaires

									// Mise à jour de l'état

									await ajoutSuppri({
										id: id,
									});
									setdata(updatedData);
								}}
							>
								<Icon
									icon={
										data.like > 0 ? "flat-color-icons:like" : "heroicons:heart"
									}
									width="20"
									height="20"
									className={`${
										data.like > 0 ? "text-blue-500" : "text-gray-400"
									} transition-transform transform hover:scale-125`}
								/>
								<span className="text-[11px] text-gray-600">
									{data.likes} Like(s)
								</span>
							</div>
							<div className="flex ml-6 mr-6 items-center space-x-1 cursor-pointer">
								<Icon
									icon="iconamoon:comment-thin"
									width="20"
									height="20"
									className="text-gray-400 hover:scale-125 transition-transform"
								/>
								<span className="text-[11px] text-gray-600">
									{data.commentaire}{" "}
									{data.commentaire > 1 ? "Commentaires" : "Commentaire"}
								</span>
							</div>

							{/* Likes */}

							<Modal
								title="Publier un commentaire"
								label={<Icon icon="iconamoon:comment-add-thin" />}
								labelClass=" inline-flex btn btn-sm whitespace-nowrap  space-x-1 cursor-pointer btn-primary  btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
								uncontrol
							>
								<div className="text-base text-slate-600 dark:text-slate-300">
									<form>
										<Textarea
											label="Commentaire"
											name="commentaire"
											type="text"
											register={register}
											onChange={(e) => setuniquecomm(e.target.value)}
										/>
										<br />
										{uniquecomm !== "" && (
											<Button
												className="btn btn-sm ml-2 p-1 bg-[#067BBF] text-white"
												onClick={async () => {
													try {
														const dateObject = new Date(); // Objet Date existant

														// Récupération de l'heure et de la date
														const heure = dateObject.toLocaleTimeString(
															"fr-FR",
															{
																hour: "2-digit",
																minute: "2-digit",
															}
														); // Format HH:MM

														const date = dateObject.toLocaleDateString("fr-FR"); // Format DD/MM/YYYY

														console.log({ heure, date });
														await ajouterCommentaire({
															profil: data1.logo ? data1.logo : data1.picture,
															auteur: data1.nom,
															idannonce: id,
															commentaire: uniquecomm,
															heure: heure,
															date: date,
														});
														setTimeout(comm, 2000);
														toast.success("Commentaire publié avec succès");
													} catch (error) {
														console.error(
															"Erreur lors de la publication du commentaire: ",
															error
														);
													}
												}}
											>
												Publier
											</Button>
										)}
									</form>
								</div>
							</Modal>
						</h6>
					</div>
					{commentaire && commentaire.length > 0 && (
						<div className="space-y-12">
							{commentaire.map((item, i) => (
								<div className="flex space-x-3 rtl:space-x-reverse ">
									<div className="lg:h-8 lg:w-8  h-7 w-7 rounded-full object-cover bg-white ring-1 overflow-hidden flex-none">
										<img
											className="h-full w-full object-contain"
											src={item?.profil}
										/>
									</div>
									<div className="flex  justify-between text-[13px]">
										{" "}
										<div>
											<span className="text-slate-700 text-sm dark:text-slate-300 font-medium  pb-1">
												{item.auteur}
											</span>
											<p className="text-slate-400 dark:text-slate-400 font-normal text-[12px]  pb-1">
												{item.date}
											</p>
											<p className="text-slate-900  dark:text-slate-300 font-medium  pb-1">
												{item.commentaire}
											</p>
										</div>
										{item.userUID === auth.currentUser.uid && (
											<div
												onClick={async () => {
													await deleteCommentaire({ iddoc: item.id });
													setTimeout(comm, 2000);
												}}
											>
												<Icon
													icon="ic:baseline-delete"
													style={{ color: "#ed2f2f" }}
												/>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				<br />
				<br />
				{data?.auteurID != auth.currentUser.uid &&
					data?.typeAnnonce === "Recrutement" &&
					cvenvoye === false && (
						<Modal
							title="Envoyer un cv"
							label="Envoyer un CV"
							labelClass="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-green-200 dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
							uncontrol
							onClose={() => {
								setLogo("");
							}}
						>
							<div className="text-base text-slate-600 dark:text-slate-300">
								<form>
									<Fileinput
										name="cv"
										label="CV"
										selectedFile={selectedFile2}
										accept=".pdf"
										placeholder="Choisir un fichier"
										onChange={(e) => {
											handleUpload2(e);
										}}
										required
									/>
									<br />
									{logo !== "" && (
										<Button
											className="btn btn-sm ml-2 p-1 bg-[#067BBF] text-white"
											onClick={async () => {
												try {
													await publierCv({
														idannonce: id,
														collection1:
															localStorage.getItem("idservice") ===
															"uX2Xg5nHLJTz8JsEAWiz"
																? "Quincaillerie"
																: "EntrepriseBtp",
														cv: logo,
														entrepriseid: data.auteurID,
														technicienUID: auth.currentUser.uid,
													});
													toast.success("CV envoyé avec succès");
													setLogo("");
													setCvenvoye(true);
												} catch (error) {
													console.error(
														"Erreur lors de la publication du cv : ",
														error
													);
												}
											}}
										>
											Publier
										</Button>
									)}
								</form>
							</div>
						</Modal>
					)}
				{cv.length > 0 &&
					data.auteurID === auth.currentUser.uid &&
					data.typeAnnonce === "Recrutement" && (
						<div className="border border-1 dark:border-slate-700 rounded p-6">
							<h6 className="text-slate-900 dark:text-slate-300 pb-6 text-lg lg:text-xl">
								CV
							</h6>
							<div className="space-y-12">
								{cv.map((item, i) => (
									<div className="flex space-x-3 rtl:space-x-reverse ">
										<div className=" h-10 w-10 rounded-full object-cover bg-white ring-1 overflow-hidden flex-none">
											<img
												className="h-full w-full object-contain"
												src={item?.devisInfo?.logo || item?.devisInfo?.picture}
											/>
										</div>
										<div className="text-[13px]">
											{" "}
											<div>
												<p className="text-slate-900  dark:text-slate-300 font-medium  pb-1">
													{item?.devisInfo?.nom}
												</p>
												<p className="text-slate-500 dark:text-slate-400 font-normal text-xs  pb-1">
													{item.date && item.date.seconds
														? new Date(
																item.date.seconds * 1000
														  ).toLocaleDateString()
														: "Date non disponible"}
												</p>
											</div>
											<a target="_blank" href={item.cvUrl}>
												Telecharger pdf
											</a>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
			</div>
		</>
	);
};
export default ProductDetails;
