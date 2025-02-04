import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import InputGroup from "@/components/ui/InputGroup";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { auth, db, imgdb } from "@/firebaseconfig";
import * as yup from "yup";
import Checkbox from "@/components/ui/Checkbox";
import Fileinput from "@/components/ui/Fileinput";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs, doc } from "firebase/firestore";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import Select from "react-select";
import { sendNotifAdmin } from "@/fonctionnotification";
import { useNavigate } from "react-router-dom";

const steps = [
	{
		id: 1,
		title: "",
	},
	{
		id: 2,
		title: "",
	},
];

const stepSchema = yup.object().shape({
	username: yup.string().required("veuillez remplir"),
	email: yup.string().email("Email invalide").required("veuillez remplir"),
	numero: yup.string().when("idservice", {
		is: "dlJINMSa04nPdbhH56Oy",
		then: yup.string().required("Veuillez remplir le numéro d'agrément."),
		otherwise: yup.string().notRequired(),
	}),

	phone: yup
		.string()
		.required("Veuillez remplir")
		.matches(/^[0-9]{9}$/, "Telephone invalide"),
	localisation: yup.string().required("veuillez remplir"),
});

const personalSchema = yup.object().shape({
	annee: yup.number().when(localStorage.getItem("idservice"), {
		is: "dlJINMSa04nPdbhH56Oy",
		then: yup.number().required("Veuillez remplir "),
		otherwise: yup.number().notRequired(),
	}),
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
	const [option, setoption] = useState([]);
	const [nom, setNom] = useState("");
	const [doc1, setdoc1] = useState("");
	const [doc2, setdoc2] = useState("");
	const [logo, setlogo] = useState("");
	const [selected, setSelected] = useState(["OM"]);
	const [om, setOm] = useState(0);
	const [momo, setMomo] = useState(0);
	const navigate = useNavigate()
	const options = [
		{
			value: "OM",
			label: "OM",
		},
		{
			value: "MOMO",
			label: "MOMO",
		},
	];
	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);
	const specialiteQuincaillerieRef = collection(db, "specialitequincaillerie");
	const [value, setValue] = useState([]);

	const handleChange = (selected) => {
		// Vérifie si le nombre d'options sélectionnées dépasse 3
		if (selected.length <= 3 && selected.length > 0) {
			setValue(selected);
		} else {
			toast.error("Vous ne pouvez sélectionner qu'entre 1 a 3 options");
		}
	};

	const quincailler = collection(db, "Quincaillerie");

	useEffect( () => {
		const fetchSpecialites = async () => {
			const querySnapshot = await getDocs(specialiteQuincaillerieRef);
			const specialitesArray = [];

			querySnapshot.forEach((doc) => {
				const data = doc.data();
				// Ajouter chaque document comme un objet avec `nom` et `id`
				specialitesArray.push({
					label: data.nom,
					value: data.id,
				});
			});
			setoption(specialitesArray);
			setValue(specialitesArray[0]);
			
		};
	fetchSpecialites()
		

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

				if (localStorage.getItem("idservice") === "uX2Xg5nHLJTz8JsEAWiz") {
					const idquincailler = await addDoc(quincailler, {
						//ajouter les informations du quincailler dans firebase
						doc1: doc1,
						doc2: doc2,
						logo: logo,
						email: email,
						localisation: localisation,
						motpasse: password,
						nom: nom,
						CodeMarchantOM: parseInt(om),
						CodeMarchantMoMo: parseInt(momo),
						telephone: telephone,
						longitude: longitude,
						latitude: latitude,
						idservice: "uX2Xg5nHLJTz8JsEAWiz",
						collectionSpecialite: "specialitequincaillerie",
						idspecialite: value,
						validationStatus: 0,
						uid: user.uid,
					});

					await sendNotifAdmin({
						newDocId: idquincailler.id,
						message: "Nouvelle inscription",
						type: "Quincaillerie",
					}).then(() => {
						console.log("notif admin envoye");
						
					});
				}

				await auth.currentUser.sendEmailVerification().then(); //envoyer un email de verification

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

										<div>
											<label className="form-label" htmlFor="mul_1">
												Specialite
											</label>
											<Select
												id="limited-select"
												options={option}
												isMulti
												value={value}
												onChange={handleChange}
												placeholder="Sélectionnez..."
											/>
										</div>
									</div>
								</div>
							)}

							{stepNumber === 1 && (
								<div>
									<div className="col">
										<div className="row md:col-span-2 col-span-1">
											<h4 className="text-base text-slate-800 dark:text-slate-300 mb-6">
												Entrer les informations
											</h4>
										</div>

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

										<Card
											title={<span className="text-sm">Code marchant</span>}
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
																if (selected.length === 1) {
																	// Affiche un message d'erreur et stoppe l'exécution
																	toast.error(
																		"Le code marchant est obligatoire"
																	);
																	return; // Empêche la modification du tableau
																} else {
																	// Supprime l'élément du tableau
																	setSelected(
																		selected.filter(
																			(item) => item !== option.value
																		)
																	);
																}
															} else {
																// Ajoute l'élément au tableau
																setSelected([...selected, option.value]);
															}
														}}
													/>
												))}

												{/* Dropdown pour les pays si "international" est sélectionné */}
												{selected.includes("OM") && (
													<div className="mt-2">
														<input
															type="number"
															min="0"
															placeholder="code marchant OM "
															required
															className="mt-2 p-2 border rounded dark:bg-slate-800 dark:text-white"
															onChange={(e) => setOm(e.target.value)}
														/>

														<br />
													</div>
												)}

												{/* Champ de saisie pour "national" */}
												{selected.includes("MOMO") && (
													<input
														type="number"
														min="0"
														placeholder="code marchant MOMO "
														required
														className="mt-2 p-2 border rounded dark:bg-slate-800 dark:text-white"
														onChange={(e) => setMomo(e.target.value)}
													/>
												)}
											</div>
										</Card>

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
