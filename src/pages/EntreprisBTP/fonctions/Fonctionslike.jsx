import { collection, addDoc, deleteDoc,getDocs,doc } from "firebase/firestore";
import { auth, db } from "@/firebaseconfig";
import { getCountFromServer, query, where } from "firebase/firestore";

export const Nombrelike = async ({ id }) => {
	try {
		const devisColl = collection(db, "Likes");
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

export const likeunique = async({id}) => { 
    
    const devisColl = collection(db, "Likes");
    const devisQuery = query(devisColl, where("idAnnonce", "==", id),where("userUID", "==", auth.currentUser.uid));
    const snapshot1 = await getCountFromServer(devisQuery);
    const count1 = snapshot1.data().count;
    return count1
}
export const ajoutSuppri = async ({id}) =>{
   
		const count1 = await likeunique({id:id})
       
		count1 > 0 ? await deleteLike({idannonce:id}) : await ajouterLike({idannonce:id})
}
export const ajouterLike = async ({ idannonce }) => {
	try {
		const like = collection(db, "Likes");
		await addDoc(like, {
			created_at: new Date(),
			idAnnonce: idannonce,
			userUID: auth.currentUser.uid,
		});
	} catch (error) {
		console.error(error);
	}
};

export const deleteLike = async ({ idannonce }) => {
	try {
		const like = collection(db, "Likes");
		const touslike = query(
			like,
			where("idAnnonce", "==", idannonce),
			where("userUID", "==", auth.currentUser.uid)
		);
		const querySnapshot = await getDocs(touslike);
		const notificationdate = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		notificationdate.forEach(async (doci) => {
            
			await deleteDoc(doc(db, "Likes", doci.id));
		});
	} catch (error) {
		console.error(error);
	}
};
