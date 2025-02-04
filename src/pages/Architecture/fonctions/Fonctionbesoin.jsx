import { db, auth } from "@/firebaseconfig";
import {
  getDoc,
  updateDoc,
  doc,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import { notificationentreprise } from "@/pages/EntreprisBTP/fonctions/FonctionNotifications";

/**fonction qui envoi le portfolio d'une personne caracterise par son idsender a un tiers detenant l'id */

export const envoiportfolio = async ({ idsender, id,date }) => {
  try {
    const portfolioEnvoye = doc(db, "DemandeServicesArchitecture", id);

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
    collection(db, "DemandeServicesArchitecture"),
    where("cibleCollection", "==", "ServicesEntrepriseArchitecture"),
    where("type", "==", localStorage.getItem("idspecialite"))
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
    collection(db, "DemandeServicesArchitecture"),
   
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
          lien: `/visualisationbesoin_archi/${devis.id}`,
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
        lien: `/visualisationbesoin_archi/${devis.id}`,
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
