import React,{useEffect,useState} from "react";
import { auth, db, imgdb } from "@/firebaseconfig";
import { collection, getDocs, where, query } from "firebase/firestore";


/** @typedef {Object} Ajoutannonce
 * @property {string} nomcollection - La nom de la collection de l'auteur du proforma.
 * @property {string} idclient- L'uid de l'auteur.
 */

/**
 * Permet d'afficher les informations du client ,realisateur d'un pro.
 * @param {infoclient} params - Les paramètres pour la recuperation.
 */

export const infoclient = async ({nomcollection,idclient}) => {
    try {
      const devisColl = collection(db, nomcollection);
      const devisQuery = query(
        devisColl,
        where("uid", "==", idclient)//recupere tous les information du technicien destinataire du proforma
      );
      const querySnapshot = await getDocs(devisQuery);
      const donnee=  querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
     
      return donnee.shift()
      
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de la deuxième collection :",
        error
      );
      return [];
    }
  };
  export const infoquincailler = async ({nomcollection,idclient}) => {
    try {
      const devisColl = collection(db, nomcollection);
      const devisQuery = query(
        devisColl,
        where("uid", "==", idclient)//recupere tous les information du technicien destinataire du proforma
      );
      const querySnapshot = await getDocs(devisQuery);
      const donnee=  querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
     
      return donnee.shift()
      
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de la deuxième collection :",
        error
      );
      return [];
    }
  };

  export const infoclient1 = async ({nomcollection,idclient}) => {
    try {
      const devisColl = collection(db, nomcollection);
      const devisQuery = query(
        devisColl,
        where("id", "==", idclient)//recupere tous les information du technicien destinataire du proforma
      );
      const querySnapshot = await getDocs(devisQuery);
      const donnee=  querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
     
      return donnee.shift()
      
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de la deuxième collection :",
        error
      );
      return [];
    }
  };