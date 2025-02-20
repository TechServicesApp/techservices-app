import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/store/api/auth/authApiSlice";
import { setUser } from "@/store/api/auth/authSlice";
import { toast } from "react-toastify";
import { auth, db } from "@/firebaseconfig";
import { collection, where, query, getDocs } from "firebase/firestore";

const schema = yup
	.object({
		email: yup.string().email("Invalid email").required("Email is Required"),
		password: yup.string().required("Password is Required"),
	})
	.required();

const LoginForm = () => {
	const [login, { isLoading }] = useLoginMutation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [email, setemail] = useState("");
	const [password, setpassword] = useState("");

	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm({
		resolver: yupResolver(schema),
		mode: "all",
	});

	const onSubmit = async (data) => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			if (user) {
				// Mettez à jour le Redux Store
				dispatch(setUser({ email: user.email, uid: user.uid }));

				// Récupérez l'ID du service
				const idService = localStorage.getItem("idservice");

				const services = {
					uX2Xg5nHLJTz8JsEAWiz: {
						collection: "Quincaillerie",
						navigateTo: "/crm",
					},
					"21xHEmO1HQC4Hst4QNup": {
						collection: "Architecture",
						navigateTo: "/architecture_devis",
					},
					"5rUVXFsgMNr2lTQebSKa": {
						collection: "BureaudEtudeBTP",
						navigateTo: "/demandedevis",
					},
					dlJINMSa04nPdbhH56Oy: {
						collection: "EntrepriseBtp",
						navigateTo: "/devis_en_attente",
					},
				};

				if (idService in services) {
					const { collection: collectionName, navigateTo } =
						services[idService];
					const q = query(
						collection(db, collectionName),
						where("uid", "==", user.uid)
					);
					const querySnapshot = await getDocs(q);

					let categoryFound = false;
					let status, reason;

					querySnapshot.forEach((doc) => {
						if (doc.data()?.idservice === idService) {
							categoryFound = true;
							status = doc.data()?.validationStatus;
							reason = doc.data()?.reason;
						}
					});

					if (categoryFound) {
						if (status === 2) {
							toast.error(`Connexion refusée : ${reason}`);
						} else {
							navigate(navigateTo);
							toast.success("Connecté avec succès");
						}
					} else {
						toast.error("Non autorisé pour cette catégorie.");
					}
				} else {
					toast.error("Service non reconnu.");
				}
			}
		} catch (error) {
			switch (error.code) {
				case "auth/invalid-credential":
					toast.error("Email ou mot de passe incorrect");
					break;
				case "auth/network-request-failed":
					toast.error("Problème de connexion réseau");
					break;
				default:
					toast.error("Une erreur s'est produite. Veuillez réessayer.");
			}
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
			<Textinput
				name="email"
				label="E-mail"
				type="email"
				register={register}
				error={errors.email}
				value={email}
				onChange={(e) => setemail(e.target.value)}
				className="h-[48px]"
				placeholder="Entrer votre email"
			/>
			<Textinput
				name="password"
				label="Mot de passe"
				type="password"
				value={password}
				onChange={(e) => setpassword(e.target.value)}
				register={register}
				error={errors.password}
				className="h-[48px]"
				placeholder="Entrer votre mot de passe"
			/>
			<div className="flex justify-between">
				<Link
					to="/forgot-password"
					className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
				>
					Mot de passe oublié?
				</Link>
			</div>

			<Button
				type="submit"
				text="Se connecter"
				className="bg-blue-500 text-slate-900 block w-full text-center text-white"
				isLoading={isLoading}
			/>
		</form>
	);
};

export default LoginForm;
