import React, { useState, useEffect, useRef,useMemo  } from "react";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import { useForm } from "react-hook-form";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { countEvent } from "@/pages/EntreprisBTP/fonctions/FonctionCalendrier";
import file2Img from "@/assets/images/icon/pdf-1.svg";
import countryList from "react-select-country-list";
import Checkbox from "@/components/ui/Checkbox";
import { v4 } from "uuid";
import Select from "@/components/ui/Select";
import {
	ajouterService,
	Ajoutprojet,
	supprimerProjet,
	supprimerService,
} from "./fonctions/Fonctionbesoin";
import { toast } from "react-toastify";
import Carousel from "@/components/ui/Carousel";
import { SwiperSlide } from "swiper/react";
import Icon from "@/components/ui/Icon";
import {
	collection,
	getDoc,
	getDocs,
	updateDoc,
	doc,
	query,
	where,
} from "firebase/firestore";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { auth, db, imgdb } from "@/firebaseconfig";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const profile = () => {
	const [isEditing, setIsEditing] = useState(false);
	const [Email, setEmail] = useState("");
	const [Nom, setNom] = useState("");
	const [Telephone, setTelephone] = useState("");
	const [Adresse, setAdresse] = useState("");
	const [Bio, setBio] = useState("");
	const [Logo, setLogo] = useState("");
	const [Specialite, setspecialite] = useState("");
	const [nombre, setnombre] = useState(0);
	const [registre, setpatante] = useState(null);
	const [patante, setregistre] = useState(null);
	const [attestation, setattestation] = useState(null);
	const [localisation, setlocalisation] = useState(null);
	const [offre, setoffre] = useState(null);
	const [titre, settitre] = useState("");
	const [project, setproject] = useState([]);
	const [comm, setcomm] = useState("");
	const [service, setService] = useState([]);
	const [data, setData] = useState([]);
	const inputRef = useRef(null);
	const logoRef = useRef(null);
  const [selected, setSelected] = useState(["national"]);
  const [numeroOrdre, setnumeroOrdre] = useState("");
	const entreprisebtp = doc(
		db,
		(localStorage.getItem("idservice") === "dlJINMSa04nPdbhH56Oy") ?"EntrepriseBtp":(localStorage.getItem("idservice") === "21xHEmO1HQC4Hst4QNup")? "Architecture":"BureaudEtudeBTP",
		localStorage.getItem("quincailler")
	);
  const [selectedCountry, setSelectedCountry] = useState("");
	const [agrement, setagrement] = useState("");
	const [annee, setannee] = useState(0);
	const [images, setImages] = useState([]);
	const [image, setimage] = useState(null);
  const [hasOrderNumber, setHasOrderNumber] = useState(null);
  const optionspays = useMemo(() => countryList().getData(), []);
  const options = [
		{
			value: "national",
			label: "National",
		},
		{
			value: "international",
			label: "International",
		},
	];

	const handleFileChange = (event) => {
		const files = Array.from(event.target.files);

		if (files.length > 3) {
			alert("Vous ne pouvez sélectionner que 3 fichiers au maximum.");
			return;
		}

		// Transformer les fichiers en données d'image
		const uploadPromises = files.map((file) => handleUpload2(file));

		// Attendre toutes les promesses
		Promise.all(uploadPromises)
			.then((uploadedUrls) => {
				// Ajouter les URLs obtenues à l'état
				console.log(uploadedUrls);
				setImages((prevImages) => [...prevImages, ...uploadedUrls]);
			})
			.catch((error) => {
				console.error("Erreur lors de l'upload des fichiers :", error);
			});
	};

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

  const changeHandler = (e) => {
		setSelectedCountry(e.target.value);
	};
	const handleUpload2 = (file) => {
		return new Promise((resolve, reject) => {
			const refdoc2 = ref(imgdb, `portfolio/${new Date().getTime() + v4()}`);
			uploadBytes(refdoc2, file)
				.then((snapshot) => getDownloadURL(snapshot.ref))
				.then((url) => resolve(url)) // Résoudre avec l'URL Firebase
				.catch((error) => {
					toast.error("Erreur lors de l'upload.");
					reject(error); // Rejeter en cas d'erreur
				});
		});
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
				});
			});
		}
	};

	const handleUpload5 = (e) => {
		var file = e.target.files[0];

		// if (file.type !== "application/pdf") {
		// 	toast.error("Veuillez sélectionner un fichier PDF.");
		// 	e.target.value = ""; // Réinitialiser le champ

		// } else {
		const refdoc2 = ref(imgdb, `portfolio/${new Date().getTime() + v4()}`);
		uploadBytes(refdoc2, e.target.files[0]).then((snapshot) => {
			getDownloadURL(snapshot.ref).then((url) => {
				setimage(url);
			});
		});
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
		await updateDoc(entreprisebtp, {
			//ajouter les informations de entreprise dans firebase
      numeroDordre:hasOrderNumber === "non" ?"": numeroOrdre,
			logo: Logo != "" ? Logo : data.logo,
			localisation: Adresse != "" ? Adresse : data.localisation,
			nom: Nom != "" ? Nom : data.nom,
			telephone: Telephone != "" ? Telephone : data.telephone,
			bio: Bio != "" ? Bio : data.bio,
			doc1:(registre!=null && registre!="") ?registre:data.registre,
            doc2:(patante!=null && patante!="" )?patante:data.registre,
			agrement: agrement != "" ? agrement : data.agrement,
			annee: annee != "" ? annee : data.annee,
		}).then(() => {
			setIsEditing(false);
			fetchpost();
		});
	};

	const fetchpost = async () => {
		try {
			const uid = auth.currentUser.uid;
			const nbre = await countEvent({ id:uid });
			setnombre(nbre);
			
			
		if(localStorage.getItem("idservice") === "dlJINMSa04nPdbhH56Oy" ){	
      const specialite = await getDoc(
				doc(db, "ServicesEntrepriseBTP", localStorage.getItem("idspecialite"))
			);
      setspecialite(specialite.data()?.label);
    }
			if (uid.length > 0) {
				const q1 = query(
					collection(db, (localStorage.getItem("idservice") === "dlJINMSa04nPdbhH56Oy") ?"EntrepriseBtp":(localStorage.getItem("idservice") === "21xHEmO1HQC4Hst4QNup")? "Architecture":"BureaudEtudeBTP",),
					where("uid", "==", uid)
				);

				const querySnapshot1 = await getDocs(q1);

				querySnapshot1.forEach((doc) => {
					if (doc.exists) {
						console.log(doc.data())
						setData(doc.data());
						setNom(doc.data()?.nom);
						setEmail(doc.data()?.email);
						setTelephone(doc.data()?.telephone);
						setAdresse(doc.data()?.localisation);
						setLogo(doc.data()?.logo);
						setproject(doc.data()?.projet || []);
						setService(doc.data()?.service || []);
						setBio(doc.data()?.bio);
						setagrement(doc.data()?.agrement);
						setannee(parseInt(doc.data()?.annee));
					setnumeroOrdre(doc.data()?.numeroDordre)
						setregistre(doc.data()?.doc1);
						setpatante(doc.data()?.doc2);
						
						
					}
				});
			} else {
				console.log("le quincailler n'est pas authentifie");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const schema = yup
		.object({
			titre: yup.string().required("veuillez remplir"),
			comm: yup.string().required("veuillez remplir"),
		})
		.required();

	const {
		register,
		control,
		formState: { errors },
		handleSubmit,
	} = useForm({
		resolver: yupResolver(schema),
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
							<div className="flex-1">
								<div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
									{annee}
								</div>
								<div className="text-sm text-slate-600 font-light dark:text-slate-300">
									Annees d'experience
								</div>
							</div>

							<div className="flex-1">
								<div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
									{nombre}
								</div>
								<div className="text-sm text-slate-600 font-light dark:text-slate-300">
									Evenements du calendrier
								</div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-12 gap-6">
						<div className="lg:col-span-4 col-span-12">
							<Card className="bg-[#067BBF]" title="Info">
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
									<div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
										Bio
									</div>

									{Bio}
								</div>
								<br />

								<div className="flex-1">
									<div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
										NUMERO AGREMENT
									</div>
									<div className="text-base text-slate-600 dark:text-slate-50">
										{agrement}
									</div>
								</div>

           {numeroOrdre &&      <div className="flex-1">
            <br />
									<div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
										NUMERO D'ORDRE
									</div>
									<div className="text-base text-slate-600 dark:text-slate-50">
										{numeroOrdre}
									</div>
								</div>}
							</Card>
						</div>
					</div>
					<div className="xl:col-span-4 lg:col-span-5 col-span-12">
						<Card title="Fichiers">
							<ul className="divide-y divide-slate-100 dark:divide-slate-700">
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
														Carte contribuable
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
								{attestation && (
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
														Attestation de conformité
													</span>
													<span className="block font-normal text-xs text-slate-500 mt-1"></span>
												</div>
											</div>
											<div className="flex-none">
												<a
													href={attestation}
													target="_blank"
													className="text-xs text-slate-900 dark:text-white"
												>
													Visualiser
												</a>
											</div>
										</div>
									</li>
								)}
								{localisation && (
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
														Plan de localisation
													</span>
													<span className="block font-normal text-xs text-slate-500 mt-1"></span>
												</div>
											</div>
											<div className="flex-none">
												<a
													href={localisation}
													target="_blank"
													className="text-xs text-slate-900 dark:text-white"
												>
													Visualiser
												</a>
											</div>
										</div>
									</li>
								)}
								{offre && (
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
														offre de Services
													</span>
													<span className="block font-normal text-xs text-slate-500 mt-1"></span>
												</div>
											</div>
											<div className="flex-none">
												<a
													href={offre}
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
					<Card noborder bodyClass="p-2" title="Services"></Card>
						<div  className="grid  xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">

							{service.map((item, i) => (
								<Card noborder bodyClass="p-0">
									<div className="image-box">
										<img
											src={item.image}
											alt=""
											className="rounded-t-md w-full h-full object-cover"
										/>
									</div>
									<div className="p-6 ">
										<div className="card-title mb-5">{item.titre}</div>
										<div className="text-sm">{item.description}</div>
									</div>
								</Card>
							))}
						</div>
				
					<Card noborder bodyClass="p-2" title="Projects"></Card>
						<div className="xl:col-span-4 lg:col-span-5 col-span-12">
							{project.map((item, i) => (
                <div>
								<Card>
									<div className="post-image mb-6">
										<Carousel
											pagination={true}
											navigation={true}
											className="main-caro"
										>
											{item.images.map((item, i) => (
												<SwiperSlide>
													<div
														className="single-slide bg-no-repeat bg-cover bg-center rounded-md min-h-[300px] "
														style={{
															backgroundImage: `url(${item})`,
														}}
													></div>
												</SwiperSlide>
											))}
										</Carousel>
									</div>
									<div className="flex justify-between mb-4">
										<Link to="#">
											<span className="inline-flex leading-5 text-slate-500 dark:text-slate-400 text-sm font-normal">
												<Icon
													icon="heroicons-outline:calendar"
													className="text-secondary-500 ltr:mr-2 rtl:ml-2 text-lg"
												/>
												{new Date(
													item.date.seconds * 1000
												).toLocaleDateString()}
											</span>
										</Link>
										<div className="flex space-x-4 rtl:space-x-reverse"></div>
									</div>
									<h5 className="card-title text-slate-900 dark:text-white">
										{item.titre}
									</h5>
									<div className="card-text mt-4">
										<p>{item.commentaire}</p>
									</div>
								</Card>
                <br />
                </div>
							))}
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
							<div className="flex-1">
								<div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
									<Textinput
										label="Nombre d'années d'expérience"
										type="number"
										defaultValue={annee}
										name="Annees"
										min="0"
										placeholder="annee"
										onChange={(e) => {
											setannee(e.target.value);
										}}
										register={register}
									/>
								</div>
							</div>

							<div className="flex-1">
								<div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
									{nombre}
								</div>
								<div className="text-sm text-slate-600 font-light dark:text-slate-300">
									Calender Events
								</div>
							</div>
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
								<Textarea
									label="bio"
									type="text"
									defaultValue={Bio}
									name="Bio"
									onChange={(e) => {
										setBio(e.target.value);
									}}
									register={register}
								/>

								<Textinput
									label="Numéro d'agrément"
									type="text"
									defaultValue={agrement}
									name="Agrement"
									placeholder="agrement"
									onChange={(e) => {
										setagrement(e.target.value);
									}}
									register={register}
								/>

<br />
<div className="space-y-4">
    {/* Étape 1 : Question pour savoir si l'utilisateur a un numéro d'ordre */}
    <div className="mb-4">
      <p className="text-sm ">Avez-vous un numéro d'ordre ?</p>
      
      <div className="flex space-x-4 mb-4">
        <Checkbox
          name="hasOrderNumber"
          label="Oui"
          value={hasOrderNumber === "oui"}
          onChange={() => setHasOrderNumber("oui")}
        />
        <Checkbox
          name="hasOrderNumber"
          label="Non"
          value={hasOrderNumber === "non"}
          onChange={() => setHasOrderNumber("non")}
        />
      </div>
    </div>

    {/* Étape 2 : Si l'utilisateur a un numéro d'ordre */}
    {hasOrderNumber === "oui" && (
      <div className="mb-4">
        {options.map((option, i) => (
          <Checkbox
            key={i}
            name="jorina"
            label={option.label}
            value={selected.includes(option.value)}
            onChange={() => {
              if (selected.includes(option.value)) {
                setSelected(selected.filter((item) => item !== option.value));
              } else {
                // Assurer l'exclusivité
                const newSelected =
                  option.value === "national"
                    ? ["national"]
                    : ["international"];
                setSelected(newSelected);
                if (option.value === "national") setSelectedCountry("Cmr");
              }
            }}
          />
        ))}

        {/* Dropdown pour les pays si "international" est sélectionné */}
        {selected.includes("international") && (
          <div className="mt-2 mb-4">
            <Select
              options={optionspays}
              value={selectedCountry}
              onChange={changeHandler}
            />
          </div>
        )}

        {/* Champ de saisie pour "national" */}
        
        {(selected.includes("national") || selectedCountry) && (
          <input
            type="text"
            placeholder="Numéro d'ordre"
            className="mt-2 p-2 border rounded dark:bg-slate-800 dark:text-white"
            onChange={(e) => setnumeroOrdre(e.target.value)}
          />
        )}
      </div>
    )}

 
  </div>
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
												className=" invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-[#067BBF] text-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
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
												className=" invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-[#067BBF] text-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
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

						<br />
						<Card noborder bodyClass="p-2" title="Services"></Card>
            <br />
							<div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
								{service.map((item, i) => (
									<Card noborder bodyClass="p-0">
										<div className="image-box">
											<img
												src={item.image}
												alt=""
												className="rounded-t-md w-full h-full object-cover"
											/>
										</div>
										<div className="p-6 ">
											<div className="card-title mb-5">{item.titre}</div>
											<div className="text-sm">{item.description}</div>
                      <div
											style={{ marginTop: 20 + "px" }}
											onClick={async () => {
												console.log(i),
													await supprimerService({
														collection: (localStorage.getItem("idservice") === "dlJINMSa04nPdbhH56Oy") ?"EntrepriseBtp":"Architecture",
														index: i,
													}).then(() => {
														toast.success("Supprime avec success");
													});
												await fetchpost();
											}}
										>
											{" "}
											<Icon
												icon="ic:baseline-delete"
												style={{ color: "#ed2f2f" }}
												height="20px"
												width="20px"
											/>
										</div>
										</div>
									
									</Card>
								))}
							</div>
							<br />
							<Modal
								title="Ajouter un Service"
								label="Ajouter un Service"
								labelClass="invocie-btn inline-flex text-white btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-[#067BBF] dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
								uncontrol
							>
								<div className="text-base text-slate-600 dark:text-slate-300">
									<form onSubmit={handleSubmit((data) => {})}>
										<Textinput
											name="titre"
											label="Nom du service"
											type="text"
											placeholder="Entrer le nom"
                     
											register={register}
											error={errors.titre}
											onChange={(e) => settitre(e.target.value)}
										/>
										<br />
										<Textarea
											label="Description"
											name="commentaire"
											type="text"
                    
											register={register}
											error={errors.comm}
											onChange={(e) => setcomm(e.target.value)}
										/>
										<br />
										<input
											required
											type="file"
											onChange={handleUpload5}
											accept="image/*" // Facultatif : pour limiter les types de fichiers
										/>
										<br />
										<br />
										{image != null  && comm!="" && titre!="" && (
											<Button
												onClick={async () => {
													try {
														await ajouterService({
															titre: titre,
															description: comm,
															image: image,
															collection: (localStorage.getItem("idservice") === "dlJINMSa04nPdbhH56Oy") ?"EntrepriseBtp":"Architecture",
														});
														toast.success("Service ajoutes avec success");
														setcomm("");
														settitre("");

														await fetchpost();
													} catch (error) {
														console.error(
															"Erreur lors de la publication du project ",
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
						
						<br />
						<Card noborder bodyClass="p-2" title="Projects"></Card>
            <br />
							{project.map((item, i) => (
                <div>
								<Card>
									<div
										style={{
											display: "flex",
											justifyContent: "end",
											marginBottom: 50 + "px",
										}}
										onClick={async () => {
											await supprimerProjet({
												collection: (localStorage.getItem("idservice") === "dlJINMSa04nPdbhH56Oy") ?"EntrepriseBtp":"Architecture",
												index: i,
											}).then(() => {
												toast.success("Supprime avec success");
											});
											await fetchpost();
										}}
									>
										<Icon
											icon="ic:baseline-delete"
											style={{ color: "#ed2f2f " }}
											heigth="30px"
											width="30px"
										/>
									</div>
									<div className="post-image mb-6">
										<Carousel
											pagination={true}
											navigation={true}
											className="main-caro"
										>
											{item.images.map((item, i) => (
												<SwiperSlide>
													<div
														className="single-slide bg-no-repeat bg-cover bg-center rounded-md min-h-[300px] "
														style={{
															backgroundImage: `url(${item})`,
														}}
													></div>
												</SwiperSlide>
											))}
										</Carousel>
									</div>
									<div className="flex justify-between mb-4">
										<Link to="#">
											<span className="inline-flex leading-5 text-slate-500 dark:text-slate-400 text-sm font-normal">
												<Icon
													icon="heroicons-outline:calendar"
													className="text-secondary-500 ltr:mr-2 rtl:ml-2 text-lg"
												/>
												{new Date(
													item.date.seconds * 1000
												).toLocaleDateString()}
											</span>
										</Link>
										<div className="flex space-x-4 rtl:space-x-reverse"></div>
									</div>
									<h5 className="card-title text-slate-900 dark:text-white">
										{item.titre}
									</h5>
									<div className="card-text mt-4">
										<p>{item.commentaire}</p>
									</div>
								</Card>
                <br />
                </div>
							))}
							<br />

							<Modal
								title="Ajouter un project"
								label="Ajouter un project"
								labelClass="invocie-btn inline-flex btn btn-sm whitespace-nowrap text-white space-x-1 cursor-pointer bg-[#067BBF] dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
								uncontrol
								onClose={() => {
									setLogo("");
								}}
							>
								<div className="text-base text-slate-600 dark:text-slate-300">
									<form onSubmit={handleSubmit((data) => {})}>
										<Textinput
											name="titre"
											label="Titre"
											type="text"
											placeholder="Entrer le titre"
                  
											register={register}
											error={errors.titre}
											onChange={(e) => settitre(e.target.value)}
										/>
										<br />
										<Textarea
											label="Details"
											name="commentaire"
                     
											type="text"
											register={register}
											error={errors.comm}
											onChange={(e) => setcomm(e.target.value)}
										/>
										<br />
										<input
											required
											type="file"
											multiple
											onChange={handleFileChange}
											accept="image/*" // Facultatif : pour limiter les types de fichiers
										/>
										<br /><br />
										{images.length > 0 && comm!="" && titre!="" && (
											<Button
												onClick={async () => {
													try {
														await Ajoutprojet({
															titre: titre,
															commentaire: comm,
															images: images,
															collection: (localStorage.getItem("idservice") === "dlJINMSa04nPdbhH56Oy") ?"EntrepriseBtp":"Architecture",
														});
														toast.success("project ajoutes avec success");
														setcomm("");
														settitre("");
														setImages([]);
														await fetchpost();
													} catch (error) {
														console.error(
															"Erreur lors de la publication du project ",
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
						
					</div>
					<button
						type="button"
						onClick={handleSaveClick}
						className="btn btn-sm ml-2 p-1 bg-[#067BBF] text-white"
					>
						Enregister
					</button>
				</div>
			)}
		</div>
	);
};

export default profile;
