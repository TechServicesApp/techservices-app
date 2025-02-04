import { collection, addDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseconfig";
import { getDocs, getCountFromServer, query, where ,doc} from "firebase/firestore";

export const NombreCommentaire = async ({ id }) => {
	try {
		const devisColl = collection(db, "Commentaires");
		const devisQuery = query(devisColl, where("idAnnonce", "==", id));
		const snapshot1 = await getCountFromServer(devisQuery);
		const count1 = snapshot1.data().count;
		return count1;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des données de la deuxième collection :",
			error
		);
	}
};

export const tousCommentaire = async ({ idannonce }) => {
	try {
		const like = collection(db, "Commentaires");
		const touslike = query(
			like,
			where("idAnnonce", "==", idannonce),
		);
		const querySnapshot = await getDocs(touslike);
		const notificationdate = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

        return notificationdate
	} catch (error) {
	
		console.error(error);
	}
};

export const ajouterCommentaire = async ({ idannonce,auteur,commentaire,heure,date,profil }) => {
	try {
		const like = collection(db, "Commentaires");
		await addDoc(like, {auteur:auteur,
			commentaire:commentaire,
			created_at:new Date(),
			date:date,
			deleted_at:null,
			heure:heure,
			idAnnonce:idannonce,
			profil:profil,
			userUID:auth.currentUser.uid
		});
	} catch (error) {
		console.error(error);
	}
};

export const deleteCommentaire = async ({ iddoc }) => {
	try {
	
			await deleteDoc(doc(db, "Commentaires", iddoc));
			
		
	} catch (error) {
		console.error(error);
	}
};
