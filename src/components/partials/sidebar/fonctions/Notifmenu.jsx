
import { auth, db, imgdb } from "@/firebaseconfig";
import {
  collection,
  updateDoc,
} from "firebase/firestore";
import { getDocs, where, query } from "firebase/firestore";

export  const modifierquincaillerie = async (data) => {

    const user = auth.currentUser
    if (data.etatnotif == 6) {
      const notificationQuincaillerieQuery = query(
        collection(db, "notificationQuincaillerie"),
        where("quincailleruid", "==", user.uid),
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

        console.log(
          "État mis à jour avec succès pour toutes les notifications."
        );
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour des notifications : ",
          error
        );
      }
    }else if(data.type === "annonce"){
      
      const notificationQuincaillerieQuery = query(
        collection(db, "notificationQuincaillerie"),
        where("quincailleruid", "==", user.uid),
        where("etatannonce", "==", data.etatnotif)
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

        console.log(
          "État mis à jour avec succès pour toutes les notifications."
        );
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour des notifications : ",
          error
        );
      }

    } else {
      const notificationQuincaillerieQuery = query(
        collection(db, "notificationQuincaillerie"),
        where("quincailleruid", "==", user.uid),
        where("etatdevis", "==", data.etatnotif)
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

        console.log(
          "État mis à jour avec succès pour toutes les notifications."
        );
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour des notifications : ",
          error
        );
      }
    }
  };


  export  const modifierentreprise = async (data) => {
    const user = auth.currentUser
    if (data.etatnotif == 3) {
      const notificationQuincaillerieQuery = query(
        collection(db, "notificationQuincaillerie"),
        where("technicienuid", "==", user.uid),
        where("type", "==", "agenda")
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

        console.log(
          "État mis à jour avec succès pour toutes les notifications."
        );
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour des notifications : ",
          error
        );
      }
    }else if(data.etatnotif === 1){
      
        const notificationQuincaillerieQuery = query(
            collection(db, "notificationQuincaillerie"),
            where("technicienuid", "==", user.uid),
            where("statut", "==", 1)
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

        console.log(
          "État mis à jour avec succès pour toutes les notifications."
        );
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour des notifications : ",
          error
        );
      }

    } else {
        const notificationQuincaillerieQuery = query(
            collection(db, "notificationQuincaillerie"),
            where("technicienuid", "==", user.uid),
            where("statut", "==", 0)
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

        console.log(
          "État mis à jour avec succès pour toutes les notifications."
        );
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour des notifications : ",
          error
        );
      }
    }
  };