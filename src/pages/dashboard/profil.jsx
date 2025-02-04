import React, { useState, useEffect, useRef } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import file2Img from "@/assets/images/icon/pdf-1.svg";
import { v4 } from "uuid";
import Icon from "@/components/ui/Icon";
import {
	collection,
	getDocs,
	updateDoc,
	doc,
	query,
	where,
} from "firebase/firestore";
import Card from "@/components/ui/Card";
import { auth,db, imgdb } from "@/firebaseconfig";
import { toast } from "react-toastify";

const profile = () => {
	const [isEditing, setIsEditing] = useState(false);
	const [Email, setEmail] = useState("");
	const [Nom, setNom] = useState("");
	const [Telephone, setTelephone] = useState("");
	const [Adresse, setAdresse] = useState("");
	const [Logo, setLogo] = useState("");
	const [Specialite, setspecialite] = useState("");
	const [OM, setOM] = useState(0);
    const [MOMO, setMOMO] = useState(0);
	const [registre, setpatante] = useState(null);
	const [patante, setregistre] = useState(null);
	const [data, setData] = useState([]);
	const inputRef = useRef(null);
	const logoRef = useRef(null);
	const entreprisebtp = doc(
		db,
		"Quincaillerie",
		localStorage.getItem("quincailler")
	);
	
	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleButtonClick = () => {
		// Déclenche le clic sur l'input
		inputRef.current.click();
	};

	const handlelogoClick = () => {
		// Déclenche le clic sur l'input
		logoRef.current.click();
	};

	
	const handleUpload3 = (e) => {
		var file = e.target.files[0];

		if (file.type !== "application/pdf") {
			toast.error("Veuillez sélectionner un fichier PDF.");
			e.target.value = ""; // Réinitialiser le champ
		} else {
			const refdoc2 = ref(imgdb, `portfolio/${new Date().getTime() + v4()}`);
			uploadBytes(refdoc2, e.target.files[0]).then((snapshot) => {
				getDownloadURL(snapshot.ref).then((url) => {
					setregistre(url);
                    console.log(url)
				});
			});
		}
	};

	const handleUpload4 = (e) => {
		var file = e.target.files[0];

		if (file.type !== "application/pdf") {
			toast.error("Veuillez sélectionner un fichier PDF.");
			e.target.value = ""; // Réinitialiser le champ
		} else {
			const refdoc2 = ref(imgdb, `portfolio/${new Date().getTime() + v4()}`);
			uploadBytes(refdoc2, e.target.files[0]).then((snapshot) => {
				getDownloadURL(snapshot.ref).then((url) => {
					setpatante(url);
                    console.log(url)
				});
			});
		}
	};

	

	const handleUploadlogo = (e) => {
		var file = e.target.files[0];

		if (!file.type.startsWith("image/")) {
			toast.error("Veuillez sélectionner une image.");
			e.target.value = ""; // Réinitialiser le champ
		} else {
			const refdoc2 = ref(imgdb, `portfolio/${new Date().getTime() + v4()}`);
			uploadBytes(refdoc2, e.target.files[0]).then((snapshot) => {
				getDownloadURL(snapshot.ref).then((url) => {
					setLogo(url);
				});
			});
		}
	};
	const handleSaveClick = async () => {
		if(MOMO ==0 && OM==0)
			toast.error("veuillez choisir au moins un des codes marchants")
		else{
		await updateDoc(entreprisebtp, {
			//ajouter les informations de entreprise dans firebase

			logo: Logo != "" ? Logo : data.logo,
            CodeMarchantMoMo:parseInt(MOMO),
            doc1:(registre!=null && registre!="") ?registre:data.registre,
            doc2:(patante!=null && patante!="" )?patante:data.registre,
            CodeMarchantOM:parseInt(OM),
			localisation: Adresse != "" ? Adresse : data.localisation,
			nom: Nom != "" ? Nom : data.nom,
			telephone: Telephone != "" ? Telephone : data.telephone,
		
			
		}).then(() => {
			setIsEditing(false);
			fetchpost();
		});
	}
	};

	const fetchpost = async () => {
		try {
			
			const uid = auth.currentUser.uid;
		
			if (uid.length > 0) {
				const q1 = query(
					collection(db, "Quincaillerie"),
					where("uid", "==", uid)
				);

				const querySnapshot1 = await getDocs(q1);

				querySnapshot1.forEach((doc) => {
					if (doc.exists) {
						setData(doc.data());
						setNom(doc.data()?.nom);
						setEmail(doc.data()?.email);
						setTelephone(doc.data()?.telephone);
						setAdresse(doc.data()?.localisation);
						setLogo(doc.data()?.logo);
						setOM(doc.data()?.CodeMarchantOM)
                        setMOMO(doc.data()?.CodeMarchantMoMo)
					
						setregistre(doc.data()?.doc1);
						setpatante(doc.data()?.doc2);
						
                        const idspecialiteValues = Array.isArray(doc.data().idspecialite)
                        ? doc.data().idspecialite.map(obj => obj.label)
                        : [doc.data().idspecialite.label];
                        setspecialite(idspecialiteValues.join(", "))
                  
					}
				});
			} else {
				console.log("le quincailler n'est pas authentifie");
			}
		} catch (error) {
			console.log(error);
		}
	};



	const {
		register,
		
		formState: { errors },
	
	} = useForm({
		
		//
		mode: "all",
	});
	useEffect(() => {
		fetchpost();
	}, []);
	return (
		<div>
			{!isEditing ? (
				<div className="space-y-5 profile-page">
					<div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
						<div className="bg-[#067BBF] dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
						<div className="profile-box flex-none md:text-start text-center">
							<div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
								<div className="flex-none">
									<div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
										<img
											src={Logo}
											alt=""
											className="w-full h-full object-cover rounded-full"
										/>
									</div>
								</div>
								<div className="flex-1">
									<div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
										{Nom}
									</div>
									<div className="text-sm font-light text-slate-600 dark:text-slate-400">
										{Specialite}
									</div>
								</div>
							</div>
						</div>

						<div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
							
						</div>
					</div>

					<div className="grid grid-cols-12 gap-6">
						<div className="lg:col-span-4 col-span-12">
							<Card title="Info">
								<ul className="list space-y-8">
									<li className="flex space-x-3 rtl:space-x-reverse">
										<div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
											<Icon icon="heroicons:envelope" />
										</div>
										<div className="flex-1">
											<div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
												EMAIL
											</div>
											<a
												href="mailto:someone@example.com"
												className="text-base text-slate-600 dark:text-slate-50"
											>
												{Email}
											</a>
										</div>
									</li>

									<li className="flex space-x-3 rtl:space-x-reverse">
										<div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
											<Icon icon="heroicons:phone-arrow-up-right" />
										</div>
										<div className="flex-1">
											<div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
												TELEPHONE
											</div>

											{Telephone}
										</div>
									</li>

									<li className="flex space-x-3 rtl:space-x-reverse">
										<div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
											<Icon icon="heroicons:map" />
										</div>
										<div className="flex-1">
											<div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
												ADRESSE
											</div>
											<div className="text-base text-slate-600 dark:text-slate-50">
												{Adresse}
											</div>
										</div>
									</li>
								</ul>
							</Card>
						</div>
						<div className="lg:col-span-8 col-span-12">
							<Card title="Informations supplementaire">
							

								<div className="flex-1">
								<div className="flex-1">
									<div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
										Code Marchant Om
									</div>
									<div className="text-base text-slate-600 dark:text-slate-50">
										{OM}
									</div>
								</div>
								<br />
									<div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
										Code Marchant Momo
									</div>
									<div className="text-base text-slate-600 dark:text-slate-50">
										{MOMO}
									</div>
								</div>
                               


							</Card>
						</div>
					</div>
					<div className="xl:col-span-4 lg:col-span-5 col-span-12">
						<Card title="Fichiers">
							<ul className="divide-y divide-slate-100 dark:divide-slate-700">
                            {registre && (
									<li className="block py-[8px]">
										<div className="flex space-x-2 rtl:space-x-reverse">
											<div className="flex-1 flex space-x-2 rtl:space-x-reverse">
												<div className="flex-none">
													<div className="h-8 w-8">
														<img
															src={file2Img}
															alt=""
															className="block w-full h-full object-cover rounded-full border hover:border-white border-transparent"
														/>
													</div>
												</div>
												<div className="flex-1">
													<span className="block text-slate-600 text-sm dark:text-slate-300">
														Registre de commerce
													</span>
													<span className="block font-normal text-xs text-slate-500 mt-1"></span>
												</div>
											</div>
											<div className="flex-none">
												<a
													href={registre}
													target="_blank"
													className="text-xs text-slate-900 dark:text-white"
												>
													Visualiser
												</a>
											</div>
										</div>
									</li>
								)}
								{patante && (
									<li className="block py-[8px]">
										<div className="flex space-x-2 rtl:space-x-reverse">
											<div className="flex-1 flex space-x-2 rtl:space-x-reverse">
												<div className="flex-none">
													<div className="h-8 w-8">
														<img
															src={file2Img}
															alt=""
															className="block w-full h-full object-cover rounded-full border hover:border-white border-transparent"
														/>
													</div>
												</div>
												<div className="flex-1">
													<span className="block text-slate-600 text-sm dark:text-slate-300">
														Patante
													</span>
													<span className="block font-normal text-xs text-slate-500 mt-1"></span>
												</div>
											</div>
											<div className="flex-none">
												<a
													href={patante}
													target="_blank"
													className="text-xs text-slate-900 dark:text-white"
												>
													Visualiser
												</a>
											</div>
										</div>
									</li>
								)}
								
							</ul>
						</Card>
					</div>
				
						
					
					<button
						type="button"
						onClick={handleEditClick}
						className="ml-2 p-1 bg-[#067BBF] text-white"
					>
						Editer
					</button>
				</div>
			) : (
				<div className="space-y-5 profile-page">
					<div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
						<div className="bg-[#067BBF] dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
						<div className="profile-box flex-none md:text-start text-center">
							<div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
								<div className="flex-none">
									<div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
										<img
											src={Logo}
											alt=""
											className="w-full h-full object-cover rounded-full"
										/>
										<button
											className=" invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-green-200 dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
											type="button"
											onClick={handlelogoClick}
										>
											<Icon icon="heroicons:pencil-square" />
										</button>

										{/* Input caché */}
										<input
											type="file"
											ref={logoRef}
											accept="image/*"
											style={{ display: "none" }} // Cache l'input
											onChange={(e) => {
												handleUploadlogo(e);
											}}
										/>
									</div>
								</div>

								<div className="flex-1">
									<div className="text-2xl   font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
										<Textinput
											label="Nom"
											type="text"
											placeholder="Entrer le nom"
											name="Nom"
											style={{ height: 30 + "%" }}
											defaultValue={Nom}
											onChange={(e) => {
												setNom(e.target.value);
											}}
											register={register}
										/>
									</div>
									<div className="text-sm font-light text-slate-600 dark:text-slate-400">
										{Specialite}
									</div>
								</div>
							</div>
						</div>
						<div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
						</div>
					</div>
					<div className="grid grid-cols-12 gap-6">
						<div className="lg:col-span-4 col-span-12">
							<Card title="Info">
								<ul className="list space-y-8">
									<li className="flex space-x-3 rtl:space-x-reverse">
										<div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
											<Icon icon="heroicons:envelope" />
										</div>
										<div className="flex-1">
											<div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
												EMAIL
											</div>

											{Email}
										</div>
									</li>

									<li className="flex space-x-3 rtl:space-x-reverse">
										<div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
											<Icon icon="heroicons:phone-arrow-up-right" />
										</div>
										<div className="flex-1">
											<Textinput
												label="Telephone"
												type="text"
												defaultValue={Telephone}
												placeholder="Telephone"
												onChange={(e) => {
													setTelephone(e.target.value);
												}}
												name="Telephone"
												register={register}
											/>
										</div>
									</li>

									<li className="flex space-x-3 rtl:space-x-reverse">
										<div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
											<Icon icon="heroicons:map" />
										</div>
										<div className="flex-1">
											<Textinput
												label="Adresse"
												type="text"
												placeholder="Adresse"
                                               
												name="Adresse"
												defaultValue={Adresse}
												onChange={(e) => {
													setAdresse(e.target.value);
												}}
												register={register}
											/>
										</div>
									</li>
								</ul>
							</Card>
						</div>
						<div className="lg:col-span-8 col-span-12">
							<Card title="Informations supplementaire">
								

								<Textinput
									label="Code marchant OM"
									type="number"
									defaultValue={OM}
									name="om"
									placeholder="OM"
									min="0"
									onChange={(e) => {
										setOM(parseInt(e.target.value));
									}}
									register={register}
								/>
                                <Textinput
									label="Code marchant MOMO"
									type="number"
									defaultValue={MOMO}
									name="momo"
									placeholder="MOMO"
									min="0"
									onChange={(e) => {
										setMOMO(parseInt(e.target.value))
									}}
									register={register}
								/>
							</Card>
						</div>
					</div>
					<div className="xl:col-span-4 lg:col-span-5 col-span-12">
						<Card title="Fichiers">
							<ul className="divide-y divide-slate-100 dark:divide-slate-700">
								<li className="block py-[8px]">
									<div className="flex space-x-2 rtl:space-x-reverse">
										<div className="flex-1 flex space-x-2 rtl:space-x-reverse">
											<div className="flex-none">
												<div className="h-8 w-8">
													<img
														src={file2Img}
														alt=""
														className="block w-full h-full object-cover rounded-full border hover:border-white border-transparent"
													/>
												</div>
											</div>
											<div className="flex-1">
												<span className="block text-slate-600 text-sm dark:text-slate-300">
													Registre de commerce
												</span>
												<span className="block font-normal text-xs text-slate-500 mt-1"></span>
											</div>
										</div>
										<div className="flex-none">
											<button
												className=" invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-green-200 dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
												type="button"
												onClick={handleButtonClick}
											>
												Changer le registre
											</button>
										</div>
									</div>
									{/* Input caché */}
									<div className="flex-1">
										{" "}
										<input
											type="file"
											ref={inputRef}
											accept=".pdf"
											style={{ display: "none" }} // Cache l'input
											onChange={(e) => {
												handleUpload3(e);
											}}
										/>
										<div>
											{registre && (
												<a href={registre} target="_blank">
													Visualiser
												</a>
											)}
										</div>
									</div>
								</li>
								<br />
								<li className="block py-[8px]">
									<div className="flex space-x-2 rtl:space-x-reverse">
										<div className="flex-1 flex space-x-2 rtl:space-x-reverse">
											<div className="flex-none">
												<div className="h-8 w-8">
													<img
														src={file2Img}
														alt=""
														className="block w-full h-full object-cover rounded-full border hover:border-white border-transparent"
													/>
												</div>
											</div>
											<div className="flex-1">
												<span className="block text-slate-600 text-sm dark:text-slate-300">
													Patante
												</span>
												<span className="block font-normal text-xs text-slate-500 mt-1"></span>
											</div>
										</div>
										<div className="flex-none">
											<button
												className=" invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-green-200 dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
												type="button"
												onClick={handleButtonClick}
											>
												Changer la patante
											</button>
										</div>
									</div>
									<div className="flex-1">
										{/* Input caché */}
										<input
											type="file"
											ref={inputRef}
											accept=".pdf"
											style={{ display: "none" }} // Cache l'input
											onChange={(e) => {
												handleUpload4(e);
											}}
										/>
									</div>

									<div>
										{patante && (
											<a href={patante} target="_blank">
												Visualiser
											</a>
										)}
									</div>
								</li>
							</ul>
						</Card>	
					</div>
					<button
						type="button"
						onClick={handleSaveClick}
						className="ml-2 p-1 bg-[#067BBF] text-white"
					>
						Enregister
					</button>
				</div>
			)}
		</div>
	);
};

export default profile;
