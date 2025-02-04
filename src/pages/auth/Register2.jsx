import React, { useState, useEffect, useMemo } from "react";
import Textinput from "@/components/ui/Textinput";
import InputGroup from "@/components/ui/InputGroup";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { auth, db, imgdb } from "@/firebaseconfig";
import * as yup from "yup";
import Fileinput from "@/components/ui/Fileinput";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import countryList from "react-select-country-list";
import { sendNotifAdmin } from "@/fonctionnotification";

const steps = [
	{
		id: 1,
		title: "",
	},
	{
		id: 2,
		title: "",
	},
	{
		id: 3,
		title: "",
	},
];

const stepSchema = yup.object().shape({
	username: yup.string().required("veuillez remplir"),
	email: yup.string().email("Email invalide").required("veuillez remplir"),

	phone: yup
		.string()
		.required("Veuillez remplir")
		.matches(/^[0-9]{9}$/, "Telephone invalide"),
	localisation: yup.string().required("veuillez remplir"),
});

const personalSchema = yup.object().shape({
	annee: yup.number().required("Veuillez remplir "),
	numero: yup.string().required("Veuillez remplir le numéro d'agrément."),
});
let socialSchema = yup.object().shape({
	password: yup
		.string()
		.required("Password is required")
		.min(8, "Password must be at least 8 characters"),
	confirmpass: yup
		.string()
		.required("Confirm Password is required")
		.oneOf([yup.ref("password"), null], "Passwords must match"),
});

const FormWizard = () => {
	const [stepNumber, setStepNumber] = useState(0);
	const [selectedFile, setSelectedFile] = useState(null);
	const [selectedFile1, setSelectedFile1] = useState(null);
	const [selectedFile2, setSelectedFile2] = useState(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [telephone, setTelephone] = useState("");
	const [localisation, setLocalisation] = useState("");
	const [selected, setSelected] = useState(["national"]);
	const [selectedCountry, setSelectedCountry] = useState("Cmr");
	const [numeroOrdre, setnumeroOrdre] = useState("");
	const [nom, setNom] = useState("");
	const [doc1, setdoc1] = useState("");
	const [doc2, setdoc2] = useState("");
	const [logo, setlogo] = useState("");
	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);
	const [agrement, setAgrement] = useState("");
	const [annee, setAnnee] = useState(0);
	const [value2, setValue2] = useState("");
	const architecture = collection(db, "Architecture");
	const [option, setoption] = useState([]);
	const [option1, setoption1] = useState([]);
	const specialiteQuincaillerieRef = collection(
		db,
		"ServicesEntrepriseArchitecture"
	);
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
	const changeHandler = (e) => {
		setSelectedCountry(e.target.value);
	};
	const [valuespecialite, setValuespecialite] = useState(1);

	const handleChange2 = (e) => {
		setValue2(e.target.value);
		setoption1(getOptions(e.target.value, option));
	};
	const handleChange3 = (e) => {
		setValuespecialite(e.target.value);
	};

	const getOptions = (value2, option) => {
		const specialitesArray = [];
		const selectedOption = option.find((o) => o.value === value2);
		if (selectedOption && selectedOption.services) {
			if (selectedOption.services.length > 0) {
				selectedOption.services.forEach((doc) => {
					specialitesArray.push({
						label: doc.label,
						value: doc.id,
					});
				});
			}
		}

		return specialitesArray;
	};

	useEffect(() => {
		const fetchSpecialites = async () => {
			try {
				const querySnapshot = await getDocs(specialiteQuincaillerieRef);
				const specialitesArray = [];

				querySnapshot.forEach((doc) => {
					const data = doc.data();
					// Ajouter chaque document comme un objet avec `nom` et `id`
					specialitesArray.push({
						label: data.label,
						value: doc.id,
						services: data.services ? data.services : [],
					});
				});
				setoption(specialitesArray);

				setValue2(specialitesArray[0].value);
				setoption1(getOptions(specialitesArray[0].value, specialitesArray));
			} catch (error) {
				console.log(error);
			}
		};
		fetchSpecialites();

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLatitude(position.coords.latitude);
					setLongitude(position.coords.longitude);
				},
				(error) => {
					console.error("Error getting geolocation:", error);
				}
			);
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	}, []);

	const getCurrentStepSchema = () => {
		switch (stepNumber) {
			case 0:
				return stepSchema;
			case 1:
				return personalSchema;
			case 2:
				return socialSchema;

			default:
				return stepSchema;
		}
	};

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm({
		resolver: yupResolver(getCurrentStepSchema()),
		mode: "all",
		context: { idservice: localStorage.getItem("idservice") },
	});

	const handleUpload = (e) => {
		setdoc2(null);
		//upload le doc 2 dans firebase
		var file = e.target.files[0];
		if (file.type !== "application/pdf") {
			toast.error("Veuillez sélectionner un fichier PDF.");
			e.target.value = ""; // Réinitialiser le champ
			setSelectedFile1(null);
		} else {
			setSelectedFile1(e.target.files[0]);
			const refdoc2 = ref(imgdb, `quincallerie/${new Date().getTime() + v4()}`);
			uploadBytes(refdoc2, e.target.files[0]).then((snapshot) => {
				getDownloadURL(snapshot.ref).then((url) => {
					setdoc2(url);
				});
			});
		}
	};

	const handleUpload1 = (e) => {
		setdoc1(null);
		//upload le doc 1 dans firebase
		var file = e.target.files[0];
		if (file.type !== "application/pdf") {
			toast.error("Veuillez sélectionner un fichier PDF.");
			e.target.value = ""; // Réinitialiser le champ
			setSelectedFile(null);
		} else {
			setSelectedFile(e.target.files[0]);
			const refdoc1 = ref(imgdb, `quincallerie/${new Date().getTime() + v4()}`);
			uploadBytes(refdoc1, e.target.files[0]).then((snapshot1) => {
				getDownloadURL(snapshot1.ref).then((url1) => {
					setdoc1(url1);
				});
			});
		}
	};

	const handleUpload2 = (e) => {
		//upload le logo dans firebase
		setlogo(null);
		var file = e.target.files[0];
		if (!file.type.startsWith("image/")) {
			alert("Veuillez sélectionner une image.");
			e.target.value = ""; // Réinitialiser le champ
			setSelectedFile2(null);
		} else {
			setSelectedFile2(e.target.files[0]);
			const reflogo = ref(imgdb, `quincallerie/${new Date().getTime() + v4()}`);
			uploadBytes(reflogo, e.target.files[0]).then((snapshot2) => {
				getDownloadURL(snapshot2.ref).then((url2) => {
					setlogo(url2);
				});
			});
		}
	};

	const onSubmit = async (data, e) => {
		e.preventDefault();
		const isLastStep = stepNumber === steps.length - 1;

		if (isLastStep) {
			try {
				//creer les identifiants dans firebase
				const userQuincailler = await auth.createUserWithEmailAndPassword(
					email,
					password
				);

				const user = userQuincailler.user;
				const idquincailler =await 	addDoc(architecture, {
					//ajouter les informations de entreprise dans firebase
					doc1: doc1,
					doc2: doc2,
					logo: logo,
					email: email,
					localisation: localisation,
					motpasse: password,
					nom: nom,
					agrement: agrement,
					numeroDordre: numeroOrdre,
					pays: selectedCountry,
					annee: annee,
					uid: user.uid,
					telephone: telephone,
					longitude: longitude,
					latitude: latitude,
					idspecialite: value2,
					idoption: valuespecialite,
					idservice: "21xHEmO1HQC4Hst4QNup",
					validationStatus: 0,
					uid: user.uid,
				});

				await auth.currentUser.sendEmailVerification().then(); //envoyer un email de verification
				await sendNotifAdmin({newDocId:idquincailler.id,message:"Nouvelle inscription",type:"Architecture"}).then(()=>{console.log("notif admin envoye")})
				toast.success("Un email de verification vous a été envoyé");
			} catch (error) {
				var errorCode = error.code;
				if (errorCode === "auth/email-already-in-use") {
					toast.error("L'email existe deja");
				} else if (errorCode === "auth/network-request-failed") {
					toast.error("Assurez vous d'avoir une bonne connexion et réesayez");
				} else {
					toast.error("Erreur d'inscription,veuillez réessayer");
					console.log(error);
				}
			}
		} else {
			setStepNumber(stepNumber + 1);
		}
	};

	const handlePrev = () => {
		setStepNumber(stepNumber - 1);
	};

	return (
		<div>
			<Card>
				<div className="grid gap-5 grid-cols-12 ">
					<div className="lg:col-span-2 col-span-12">
						<div className="flex z-[5] items-start relative flex-col lg:min-h-full md:min-h-[200px] min-h-[150px]">
							{steps.map((item, i) => (
								<div className="relative z-[1] flex-1 last:flex-none" key={i}>
									<div
										className={`${
											stepNumber >= i
												? "bg-slate-900 text-white ring-slate-900 dark:bg-slate-900 dark:ring-slate-700 dark:ring-offset-slate-500 ring-offset-2"
												: "bg-white ring-slate-900 ring-opacity-70 text-slate-900 dark:text-slate-300 text-opacity-70 dark:bg-slate-700 dark:ring-slate-700"
										} transition duration-150 icon-box md:h-12 md:w-12 h-8 w-8 rounded-full flex flex-col items-center justify-center relative z-[66] ring-1 md:text-lg text-base font-medium`}
									>
										{stepNumber <= i ? (
											<span> {i + 1}</span>
										) : (
											<span className="text-3xl">
												<Icon icon="bx:check-double" />
											</span>
										)}
									</div>

									<div
										className={`${
											stepNumber >= i
												? "bg-slate-900 dark:bg-slate-900"
												: "bg-[#E0EAFF] dark:bg-slate-600"
										} absolute top-0 left-1/2 -translate-x-1/2 h-full w-[2px]`}
									></div>
									<div
										className={`${
											stepNumber >= i
												? "text-slate-900 dark:text-slate-300"
												: "text-slate-500 dark:text-slate-300 dark:text-opacity-40"
										} absolute top-0 ltr:left-full rtl:right-full ltr:pl-4 rtl:pr-4 text-base leading-6 md:mt-3 mt-1 transition duration-150 w-full`}
									>
										<span className="w-max block">{item.title}</span>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="conten-box lg:col-span-9 col-span-12">
						<form onSubmit={handleSubmit(onSubmit)}>
							{stepNumber === 0 && (
								<div>
									<div className="col">
										<div className="row lg:col-span-3 md:col-span-2 col-span-1">
											<h4 className="text-base text-slate-800 dark:text-slate-300 mb-6">
												Entrer les informations
											</h4>
										</div>
										<Textinput
											className="row mb-2"
											label="Nom structure"
											type="text"
											placeholder="nom"
											name="username"
											register={register}
											error={errors.username}
											value={nom}
											onChange={(e) => setNom(e.target.value)}
										/>
<br />
										<Textinput
											className="row"
											label="E-mail"
											type="email"
											placeholder="email"
											name="email"
											error={errors.email}
											register={register}
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										/>
<br />
										<InputGroup
											className="row"
											label="Téléphone"
											type="text"
											prepend="+237"
											placeholder="numero de téléphone"
											name="phone"
											error={errors.phone}
											register={register}
											value={telephone}
											onChange={(e) => setTelephone(e.target.value)}
										/>
<br />
										<Textinput
											className="row"
											label="Adresse"
											type="text"
											placeholder="adresse"
											name="localisation"
											error={errors.localisation}
											register={register}
											value={localisation}
											onChange={(e) => setLocalisation(e.target.value)}
										/>
<br />
										<Select
											label="Spécialité"
											options={option}
											onChange={(e) => {
												handleChange2(e);
											}}
											value={value2}
										/>
<br />
										{option1.length > 0 && (
											<Select
												label="options"
												options={option1}
												onChange={handleChange3}
												value={valuespecialite}
											/>
										)}
									</div>
								</div>
							)}

							{stepNumber === 1 && (
								<div>
									<div className="col">
										<div className="row md:col-span-2 col-span-1">
											<h4 className="text-base text-slate-800 dark:text-slate-300 mb-6">
												
											</h4>
										</div>
										<Textinput
											className="row"
											label="Numero d'agrement"
											type="text"
											placeholder="Numero d'agrement"
											name="numero"
											error={errors.numero}
											register={register}
											value={agrement}
											onChange={(e) => setAgrement(e.target.value)}
										/>
                    <br />
										<Textinput
											className="row"
											label="Annee d'experience"
											type="number"
											min="0"
											placeholder="Annee d'experience"
											name="annee"
											error={errors.annee}
											register={register}
											value={annee}
											onChange={(e) => setAnnee(e.target.value)}
										/>

										<br />
										<Fileinput
											name="logo"
											label="logo"
											selectedFile={selectedFile2}
											preview
											accept="image/*"
											placeholder="choose file"
											onChange={(e) => {
												handleUpload2(e);
											}}
											required
										/>

										<br />
										<Fileinput
											className="row"
											label="Registre de commerce"
											type="file"
											selectedFile={selectedFile}
											accept=".pdf"
											placeholder="choose file"
											name="doc1"
											required
											onChange={(e) => {
												handleUpload1(e);
											}}
										/>

										<br />
										<Fileinput
											label="Patante"
											type="file"
											accept=".pdf"
											selectedFile={selectedFile1}
											onChange={(e) => {
												handleUpload(e);
											}}
											placeholder="choose file"
											name="doc2"
											required
										/>

										<br />
									</div>
								</div>
							)}
							{stepNumber === 2 && (
								<div>
									<div className="col">
										<div className="row md:col-span-2 col-span-1">
											<h4 className="text-base text-slate-800 dark:text-slate-300 mb-6">
												Entrer les informations
											</h4>
										</div>
										<div className="space-y-3">
										<Card
												title={<span className="text-sm">Numéro d'ordre</span>}
											>
												<div className="space-y-4">
													{options.map((option, i) => (
														<Checkbox
															key={i}
															name="jorina"
															label={option.label}
															value={selected.includes(option.value)}
															onChange={() => {
																if (selected.includes(option.value)) {
																	setSelected(
																		selected.filter(
																			(item) => item !== option.value
																		)
																	);
																} else {
																	// Ensure mutual exclusivity
																	const newSelected =
																		option.value === "national"
																			? ["national"]
																			: ["international"];
																	setSelected(newSelected);
																	if (option.value === "national")
																		setSelectedCountry("Cmr");
																}
															}}
														/>
													))}

													{/* Dropdown pour les pays si "international" est sélectionné */}
													{selected.includes("international") && (
														<div className="mt-2">
															<Select
																options={optionspays}
																value={selectedCountry}
																onChange={changeHandler}
															/>

															<br />
														</div>
													)}

													{/* Champ de saisie pour "national" */}
													{(selected.includes("national") ||
														selectedCountry) && (
														<input
															type="text"
															placeholder="Numéro d'ordre "
															className="mt-2 p-2 border rounded dark:bg-slate-800 dark:text-white"
															onChange={(e) => setnumeroOrdre(e.target.value)}
														/>
													)}
												</div>
											</Card>
											<br />
											<Textinput
												label="Mot de passe"
												type="password"
												placeholder="8+ characteres"
												name="password"
												error={errors.password}
												hasicon
												register={register}
												value={password}
												onChange={(e) => setPassword(e.target.value)}
											/>
                      <br />
											<Textinput
												label="Confirmer le mot de passe"
												type="password"
												placeholder="mot de passe"
												name="confirmpass"
												error={errors.confirmpass}
												register={register}
												hasicon
											/>
										</div>
									</div>
								</div>
							)}
							<div
								className={`${
									stepNumber > 0 ? "flex justify-between" : "text-right"
								} mt-5`}
							>
								{stepNumber !== 0 && (
									<Button
										text="prev"
										className="btn-dark h-15 text-center"
										onClick={handlePrev}
									/>
								)}

								{stepNumber !== steps.length - 1 ? (
									<Button
										text="Suivant"
										className="btn-dark h-15 text-center"
										type="submit"
									/>
								) : (
									logo &&
									doc1 &&
									doc2 && (
										<Button
											text="S'inscrire"
											className="btn-dark h-15 text-center"
											type="submit"
										/>
									)
								)}
							</div>
						</form>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default FormWizard;
