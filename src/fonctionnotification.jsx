import { auth, db } from "@/firebaseconfig";
import {
  collection,
  getDocs,
  where,
  query,
  setDoc,
  updateDoc,
  doc,
  addDoc
} from "firebase/firestore";
import { bonCommande } from "@/pages/dashboard/fonctions/FonctionProforma";
import { notificationentreprise } from "@/pages/EntreprisBTP/fonctions/FonctionNotifications";

/**
 * Permet de creer les nouvelles notifications du quincailler.
 * @param { fetchPost } 
 */


//permet de creer les notifications du quincailler
export const fetchPost = async () => {
  const notifEnvoye = doc(collection(db, "notificationQuincaillerie"));

  /********************** recuperer toutes les notifications du quincailler********************/
  const notificationQuincaillerieData = await notificationentreprise()

  
  const filteredDevis1 = await bonCommande()


  /******************* ajouter tous les bons de cmde n'ayant pas encore de notifications **********/
  filteredDevis1.forEach((devis) => {
    const besoinFound = notificationQuincaillerieData.some(
      (notifQuincaillerie) => notifQuincaillerie.iddoc === devis.id
    );

    if (!besoinFound) {
      
      setDoc(notifEnvoye, {
        iddevis: devis.id,
        matricule: devis.id,
        devisId: devis.id,
        iddoc: devis.id,
        lien: `/modification/${devis.id}`,
        type: "bonCmde",
        titre: "Bon de commande",
        message: "Nouveau bon de commande",
        etat: false,
        technicienuid: auth.currentUser.uid,
        idnotif: notifEnvoye.id,
      });
    }

  });

  /**************************************************** */

  const besoinQuincaillerieQuery1 = query(
    collection(db, "DevisQuincailler"),
    where("quincailleruid", "==", auth.currentUser.uid),
    where("etat", "in", [1, 3, 4, 5])
  );
  const besoinQuincaillerieSnapshot1 = await getDocs(besoinQuincaillerieQuery1);
  const besoinQuincaillerieData1 = besoinQuincaillerieSnapshot1.docs.map(
    (doc) => doc.data()
  );
 
  besoinQuincaillerieData1.forEach((devis) => {
    const besoinFound = notificationQuincaillerieData.some(
      (notifQuincaillerie) =>
        notifQuincaillerie.iddoc === devis.Id &&
        notifQuincaillerie.statut === devis.etat
    );

    if (!besoinFound) {
      let messageText = "";
      // Déterminer la valeur du message en fonction de devis.etat
      if (devis.etat === 1) {
        messageText = "accepté";
      } else if (devis.etat === 3) {
        messageText = "payé";
      } else if (devis.etat === 4) {
        messageText = "livraison effectuée";
      } else if (devis.etat === 5) {
        messageText = "refusé";
      }

      setDoc(notifEnvoye, {
        iddoc: devis.Id,
      statut: devis.etat,
        message: messageText,
        type: "proforma",
        titre: `Proforma N° ${devis.matriculeDevis}`,
        etat: false,
        matricule: devis.matriculeDevis,
        idbesoin: devis.besoinId,
        technicienuid: auth.currentUser.uid,
        idnotif: notifEnvoye.id,
        lien: `/facture/${devis.Id}`,
      });
    }
  });

  const notifi = notificationQuincaillerieData.filter(
    (item) => item.etat === false
  );

  return notifi;
};



/********************************************************************************* */
//permet de d'afficher les notifications dans la page notification selon le type de service

/**
 * permet de d'afficher les notifications dans la page notification selon le type de service
 


/************************************************************** */
/**  @typedef {Object}  Notificationclick 
 
 * @property {integer} etat - l'etat des notifications

 */

/**
 * Permet de marquer tous les notifications a lu pour un etat precis.
 * @param { Notificationclick }
 */

export const Notificationclick = async ({ etat }) => {


  const notificationQuincaillerieQuery = query(
    collection(db, "notificationQuincaillerie"),
    where("quincailleruid", "==", auth.currentUser.uid),
    where("etatdevis", "==", etat)
  );
  try {
    const querySnapshot = await getDocs(notificationQuincaillerieQuery);

    // Iterate through each document and update its state

    const updatePromises = querySnapshot.docs.map(async (doc) => {
      const notificationRef = doc.ref;

      await updateDoc(notificationRef, {
        etat: true,
      });
    });

    // Wait for all updates to complete

    await Promise.all(updatePromises);
  } catch (error) {
    console.log(error)
  }
}

/************************************************************** */

/************************************************************** */
/**  @typedef {Object} Notificationid
 
 * @property {integer} id - l'id du devis

 */

/**
 * Permet de marquer tous les notifications a lu pour un devis du quincailler.
 * @param { Notificationid }
 */
export const Notificationid = async ({ id }) => {

  const notificationQuincaillerieQuery = query(
    collection(db, "notificationQuincaillerie"),
    where("quincailleruid", "==", auth.currentUser.uid),
    where("devisQuincaillerId", "==", id)
  );
  try {
    const querySnapshot = await getDocs(notificationQuincaillerieQuery);

    // Iterate through each document and update its state

    const updatePromises = querySnapshot.docs.map(async (doc) => {
      const notificationRef = doc.ref;

      await updateDoc(notificationRef, {
        etat: true,
      });
    });
  n
    // Wait for all updates to complete

    await Promise.all(updatePromises);
  } catch (error) {
    console.log(error)
  }
}

/******************************************************** */

/**
 * Permet de marquer tous les notifications a lu concernant les bons de commandes.
 * @param { Notificationcmdclick }
 */
export const Notificationcmdclick = async () => {
  const notificationQuincaillerieQuery = query(
    collection(db, "notificationQuincaillerie"),
    where("quincailleruid", "==", auth.currentUser.uid),
    where("type", "==", "bonCmde")
  );
  try {
    const querySnapshot = await getDocs(notificationQuincaillerieQuery);

    // Iterate through each document and update its state

    const updatePromises = querySnapshot.docs.map(async (doc) => {
      const notificationRef = doc.ref;

      await updateDoc(notificationRef, {
        etat: true,
      });
    });

    // Wait for all updates to complete

    await Promise.all(updatePromises);
  }
   catch (error) {

  }
}


/*************************************************************** */
/**  @typedef {Object}  notifiquincaillerie 
 
 * @property {string} desti - le nom de la collection du destinataire(client,Technicien....)
@property {string} icone - le nom de l'icone qui sera affiche
@property {string} titleNotification - le titre de la notification
@property {string} descriptionNotification - la description de la notification
@property {string} serviceid - l'id du besoin'
@property {string} technicienuid - l'uid du destinataire'
@property {string} uidquincailler - l'uid du quincailler'
@property {string} typeNotification - le type de notification


 */

/**
 * Permet d'envoyer des notifications au client'
 * @param { notifiquincaillerie }
 */

//envoyer des notifications
export const notifiquincaillerie = async ({desti, icone, serviceid, typeNotification, titleNotification, descriptionNotification, uidquincailler, technicienuid }) => {
  try {
    const ref = collection(db, "Notification")
    await addDoc(ref, {
      typeNotification: typeNotification,
      NotificationId: serviceid,
      titleNotification: titleNotification,
      descriptionNotification: descriptionNotification,
      statutNotification: 1,
      serviceId: serviceid,
      UserId: uidquincailler,
      technicienId: technicienuid,
      destinataire:desti,
      created_at: new Date(),
      icon: icone,
    });
  } catch (error) {
    console.log(error)
  }
}


/******************************************************** */

/**
 * A number, or a string containing a number.
 * @typedef {(number)} NumberLike
 */

/**
 * permet de transformer des chiffres en representation de montant
 * @param {NumberLike} num - le nombre a formatter.
 */
//permet de transformer des chiffres en representation de montant
export const formatNumberWithSpaces = (num) => {
  // Convertit le nombre en chaîne de caractères
  let strNum = num.toString();
  // Utilise une expression régulière pour ajouter des espaces après chaque groupe de trois chiffres
  return strNum.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
}

export const sendNotifAdmin = async({newDocId,message,type}) => {
  try {
    const ref = collection(db, "adminsNotifications")
    await addDoc(ref, {
      objectId: newDocId,
      title: "Nouvelle notification application web",
      message: message,
      type: type,
      isRead: false,
      timestamp: Date.now()
    });
  } catch (error) {
    console.log(error)
  }
}

export const handleNotificationClick = async (item) => {
  
  const notificationentreprise = query(
    collection(db, "notificationQuincaillerie"),
    where("technicienuid", "==", auth.currentUser.uid),
    where("iddoc", "==", item.iddoc),
    where("etat", "==", false)
  );

  try {
    const querySnapshot = await getDocs(notificationentreprise);

    // Iterate through each document and update its state

    const updatePromises = querySnapshot.docs.map(async (doc) => {
      const notificationRef = doc.ref;

      await updateDoc(notificationRef, {
        etat: true,
      });
    });

    // Wait for all updates to complete

    await Promise.all(updatePromises);

    console.log("État mis à jour avec succès pour toutes les notifications.");

    // Rediriger vers la page appropriée en fonction du type de notification

    
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des notifications : ",
      error
    );
  }
};