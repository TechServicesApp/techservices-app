import { db, auth } from "@/firebaseconfig";
import {
  getDoc,
  updateDoc,
  doc,
  query,
  getDocs,
  collection,
  arrayUnion,
  where,
  addDoc,
} from "firebase/firestore";
import { notificationentreprise } from "./FonctionNotifications";

/**fonction qui envoi le portfolio d'une personne caracterise par son idsender a un tiers detenant l'id */

export const envoiportfolio = async ({ idsender, id,date }) => {
  try {
    const portfolioEnvoye = doc(db, "DemandeServices", id);

    const doc2 = await getDoc(portfolioEnvoye);

    // Vérifie que idsenderportfolio est un tableau, sinon initialise un tableau vide
    let data = doc2.data()?.idsenderportfolio || [];

    // Ajoute l'ID à l'array
    data.push({ id: idsender,datechoisi:date });

    // Met à jour le document avec le nouveau tableau
    await updateDoc(portfolioEnvoye, {
      idsenderportfolio: data,
    });
    
  } catch (error) {
    console.log(error);
  }
};

/**fonction de recuperation de tous les besoins */
export const tousBesoins = async () => {
  const devisQuery = query(
    collection(db, "DemandeServices"),
    where("cibleCollection", "==", "ServicesEntrepriseBTP"),
    where("cibleId", "==", localStorage.getItem("idspecialite"))
  );

  const devisSnapshot = await getDocs(devisQuery);
  const devisData = devisSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return devisData;
};

/**fonction de recuperations des besoins dont le portfolio a été accepté */

export const besoinPortfolio = async () => {
  const devisQuery = query(
    collection(db, "DemandeServices"),
    where("cibleCollection", "==", "ServicesEntrepriseBTP"),
    where("cibleId", "==", localStorage.getItem("idspecialite")),
    where("selected", "==",localStorage.getItem("quincailler"))
  );

  const devisSnapshot = await getDocs(devisQuery);
  const devisData = devisSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return devisData;
};
/**fonction d'ajout des notifications sur les besoins */

export const notificationbesoin = async () => {
  const besoins = await tousBesoins();

  const notifentreprise = await notificationentreprise();

  const notifEnvoye = collection(db, "notificationQuincaillerie");
  const filteredDevis = [];

  besoins.forEach((devis) => {
    // Récupérer le tableau idsenderportfolio

    if (devis.selected ===localStorage.getItem("quincailler")) {
      const besoinFound = notifentreprise.some((notifQuincaillerie) => {
        return (
          notifQuincaillerie.iddoc === devis.id &&
          notifQuincaillerie.statut === 0
        );
      });
      if (!besoinFound) {
        addDoc(notifEnvoye, {
          iddoc: devis.id,
          lien: `/visualisationbesoin/${devis.id}`,
          type: "besoinsaccepte",
          titre: "Votre portfolio a été accepté",
          etat: false,
          statut: 0,
          technicienuid: auth.currentUser.uid,
          idnotif: notifEnvoye.id,
        });
      }
    } else {
      const idsenderportfolio = devis.idsenderportfolio || [];

      // Vérifier si aucun objet dans idsenderportfolio n'a un id correspondant à localStorage
      const besoinNotFound = !idsenderportfolio.some(
        (besoinQuincaillerie) =>
          besoinQuincaillerie.id ===localStorage.getItem("quincailler")
      );

      // Si aucun id correspondant n'est trouvé, ajouter le devis au tableau filtré
      if (besoinNotFound) {
        filteredDevis.push(devis);
      }
    }
  });

  /******************* ajouter tous lesbesoins n'ayant pas encore de notifications **********/
  filteredDevis.forEach((devis) => {
    const besoinFound = notifentreprise.some((notifQuincaillerie) => {
      return (
        notifQuincaillerie.iddoc === devis.id && notifQuincaillerie.statut === 1
      );
    });

    if (!besoinFound) {
      addDoc(notifEnvoye, {
        iddoc: devis.id,
        lien: `/visualisationbesoin/${devis.id}`,
        type: "besoins",
        titre: "Nouveau besoin",
        etat: false,
        statut: 1,
        technicienuid: auth.currentUser.uid,
        idnotif: notifEnvoye.id,
      });
    }
  });
};


export const Ajoutprojet = async({titre,commentaire,images,collection}) => {
try{
  const docRef = doc(db, collection, localStorage.getItem("quincailler"));

  await updateDoc(docRef, {
  projet: arrayUnion({
    titre:titre,
    commentaire:commentaire,
    images:images,
    date:new Date()
  }), // Ajoute ou crée le tableau
  });

  console.log("Objet ajouté au tableau (créé ou mis à jour) !");
} catch (error) {
  console.error("Erreur lors de l'ajout de l'objet au tableau :", error);
  throw error; // Pour remonter l'erreur si nécessaire
}
}


export const supprimerProjet = async({collection, index})=> {
 

  try {
    const docRef = doc(db, collection, localStorage.getItem("quincailler"));
    const docSnapshot = await getDoc(docRef)

    // Récupérer le tableau actuel
    const data = docSnapshot.data();
    const array = data?.projet;

    if (!Array.isArray(array)) {
      console.log(`${fieldName} n'est pas un tableau.`);
      return;
    }

    // Vérifier si l'index est valide
    if (index < 0 || index >= array.length) {
      console.log("Index invalide.");
      return;
    }

    // Étape 2 : Supprimer l'objet à l'index donné
    array.splice(index, 1); // Modifie le tableau localement
   

    // Étape 3 : Mettre à jour le tableau modifié dans Firestore
    await updateDoc(docRef,{ projet: array });
    console.log("Objet supprimé avec succès.");
  } catch (error) {
    console.error("Erreur lors de la suppression de l'objet :", error);
  }
}

export const ajouterService = async({titre,image,description,collection}) => {

  try{
    const docRef = doc(db, collection, localStorage.getItem("quincailler"));
  
    await updateDoc(docRef, {
      service: arrayUnion({
      titre:titre,
     description:description,
      date:new Date(),
      image:image
    }), // Ajoute ou crée le tableau
    });
  
    console.log("Objet ajouté au tableau (créé ou mis à jour) !");
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'objet au tableau :", error);
    throw error; // Pour remonter l'erreur si nécessaire
  }

}

export const supprimerService = async({collection, index})=> {
 

  try {
    const docRef = doc(db, collection, localStorage.getItem("quincailler"));
    const docSnapshot = await getDoc(docRef)

    // Récupérer le tableau actuel
    const data = docSnapshot.data();
    const array = data?.service;

    if (!Array.isArray(array)) {
      console.log(`${fieldName} n'est pas un tableau.`);
      return;
    }

    // Vérifier si l'index est valide
    if (index < 0 || index >= array.length) {
      console.log("Index invalide.");
      return;
    }

    // Étape 2 : Supprimer l'objet à l'index donné
    array.splice(index, 1); // Modifie le tableau localement
   

    // Étape 3 : Mettre à jour le tableau modifié dans Firestore
    await updateDoc(docRef,{ service: array });
    console.log("Objet supprimé avec succès.");
  } catch (error) {
    console.error("Erreur lors de la suppression de l'objet :", error);
  }
}

