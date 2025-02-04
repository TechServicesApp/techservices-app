import { collection, addDoc } from "firebase/firestore";
import { auth, db} from "@/firebaseconfig";
import {
  getDoc,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore";
import { notificationentreprise } from "@/pages/EntreprisBTP/fonctions/FonctionNotifications";
import { infoclient } from "@/pages/dashboard/InfoClient";
import { Nombrelike,likeunique } from "./Fonctionslike";
import { NombreCommentaire } from "./Fonctionscommentaire";

/**
 * @typedef {Object} Ajoutannonce
 * @property {string} auteur - La nom de la collection de l'auteur de l'annonce.
 * @property {string} id - L'uid de l'auteur.
 * @property {string} cible- Le nom de la collection de la cible
 * @property {string} image - l'url de l'image de publication.
 *@property {integer} statut - statut de l'annonce (1= visible, 0= non visible)
 */

/**
 * Ajoute une annonce.
 * @param {Ajoutannonce} params - Les paramètres pour l'envoi de l'annonce.
 */

export const Ajoutannonce = async ({
  nameAuteur,
  logo,
  description,
  typeFichier,
  typeAnnonce,
  auteur,
  id,
  titre,
  cible,
  fichier,
  statut,
}) => {
  const annonce = collection(db, "Annonces");
  try {
  const idannonce=  await addDoc(annonce, {
      //ajouter les informations de l'annonce dans firebase
      auteurCollection: auteur,
      titre: titre,
      description: description,
      auteurID: id,
      cibleCollection: cible,
      allUsers: true,
      fichier: fichier,
      statut: statut,
      typeAnnonce: typeAnnonce,
      typeFichier: typeFichier,
      created_at: new Date(),
      updated_at: new Date(),
      pub: false,
      nameAuteur: nameAuteur,
      logo: logo,
    });

    return idannonce.id
  } catch (error) {
    console.log(error);
  }
};

/**
 * @typedef {Object} Afficherannonce
 
 * @property {string} id - L'uid de l'auteur.
 */

/**
 * Affiche les annonces publiees.
 * @param {Afficherannonce} params - Les paramètres pour l'affichage de l'annonce.
 */
export const Afficherannonce = async ({ id }) => {
  try {
    const devisColl = collection(db, "Annonces");
    const devisQuery = query(devisColl, where("auteurID", "==", id));
    const querySnapshot = await getDocs(devisQuery);
    const filteredDevis = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const promises = filteredDevis.map(async (item) => {
      const devisInfo = await infoclient({
        nomcollection: item.auteurCollection,
        idclient: item.auteurID,
      });

      const likes =await  Nombrelike({id:item.id})
      const like = await likeunique({id:item.id})
      const commentaire = await NombreCommentaire({id:item.id})
      return {
        ...item,
        likes:likes,
        like:like,
        commentaire:commentaire,
        devisInfo: devisInfo,
      };
    });

    const newDataWithDevis = await Promise.all(promises);

    return newDataWithDevis;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données de la deuxième collection :",
      error
    );
    return [];
  }
};

export const Afficheractualite = async ({ id }) => {
  try {
    const devisColl = collection(db, "Annonces");
    const devisQuery = query(devisColl, where("auteurID", "!=", id));
    const querySnapshot = await getDocs(devisQuery);
    const filteredDevis = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const promises = filteredDevis.map(async (item) => {
      const devisInfo = await infoclient({
        nomcollection: item.auteurCollection,
        idclient: item.auteurID,
      });

      const likes =await  Nombrelike({id:item.id})
      const like = await likeunique({id:item.id})
      const commentaire = await NombreCommentaire({id:item.id})
      return {
        ...item,
        likes:likes,
        like:like,
        commentaire:commentaire,
        devisInfo: devisInfo,
      };
    });

    const newDataWithDevis = await Promise.all(promises);

    return newDataWithDevis;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données de la deuxième collection :",
      error
    );
    return [];
  }
};

export const annonceUnique = async ({ id }) => {
  const doc2 = await getDoc(doc(db, "Annonces", id));
  const commentaire = await NombreCommentaire({id:id})
  const likes =await  Nombrelike({id:id})
  const like = await likeunique({id:id})
  const data1 = doc2.data();
  const devisInfo = await infoclient({
    nomcollection: data1.auteurCollection,
    idclient: data1.auteurID,
  });
  const updatedData = { ...data1,id,commentaire:commentaire, likes:likes,
    like:like, devisInfo };

  return updatedData;
};


export const cvRecrutement = async({annonceid}) => {
try{
  const devisColl = collection(db, "CVrecrutements");
  const devisQuery = query(devisColl, where("annonceId", "==", annonceid));
  const querySnapshot = await getDocs(devisQuery);
  const filteredDevis = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const promises = filteredDevis.map(async (item) => {
    const devisInfo = await infoclient({
      nomcollection: item.collection,
      idclient: item.technicienUID,
    });
    return {
      ...item,
      devisInfo: devisInfo,
    };
  });

  const newDataWithDevis = await Promise.all(promises);

  return newDataWithDevis;
}catch(error){
  console.log(error)
}

}


export const publierCv = async ({
  idannonce,
  collection1,
  cv,
  entrepriseid,
  technicienUID,
}) => {
  const CV = collection(db, "CVrecrutements");
  try {
    await addDoc(CV, {
      annonceId: idannonce,
      collection: collection1,
      cvUrl: cv,
      date: new Date(),
      entrepriseId: entrepriseid,
      technicienUID: technicienUID,
    });
  } catch (error) {
    console.log(error);
  }
};

export const notificationannonce = async() => {
  const notifEnvoye = collection(db, "notificationQuincaillerie");
  const notificationannonce =await Afficherannonce({id:auth.currentUser.uid})

  const notificationQuincaillerieData = await notificationentreprise()
  notificationannonce.forEach((devis) => {
    const besoinFound = notificationQuincaillerieData.some(
      (notifQuincaillerie) =>
        notifQuincaillerie.iddoc === devis.id &&
        notifQuincaillerie.statut === devis.statut
    );

    if (!besoinFound) {
      let messageText = "";
      let nav = ""
      // Déterminer la valeur du message en fonction de devis.etat
      if (devis.statut === 2) {
        messageText = "Votre annonce a été acceptée";
        nav = "annonceacceptée"

      } else if (devis.statut === 0) {
        messageText = "Votre annonce a été refusée";
        nav = "annoncerefusee"
      }
      
      if(messageText!=""){
      addDoc(notifEnvoye, {
        iddoc: devis.id,
       statut: devis.statut,
        message: messageText,
        matricule: devis.id,
        type: "annonce",
        titre: `Information sur votre annonce`,
        nav: nav,
        etat: false,
        technicienuid: auth.currentUser.uid,
        idnotif: notifEnvoye.id,
        lien: `/voirplus/${devis.id}`,
      });
    }
    }
  })
}