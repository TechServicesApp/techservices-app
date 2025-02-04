import { addDoc, collection, getDocs, getDoc,doc,query,updateDoc, where } from "firebase/firestore";
import { db } from "@/firebaseconfig";
import { async } from "@firebase/util";
import { infoclient1 } from "../InfoClient";

/**
 * @typedef {Object} Ajoutannonce
 * @property {string} auteur - Le nom de la collection de l'auteur de l'annonce.
 * @property {string} id - L'UID de l'auteur.
 * @property {string} cible - Le nom de la collection de la cible.
 * @property {string} image - L'URL de l'image de publication.
 * @property {number} statut - Statut de l'annonce (1 = visible, 0 = non visible).
 */

/**
 * Affiche les plaintes pour un utilisateur donné.
 * @param {Object} params - Les paramètres pour l'affichage des plaintes.
 * @param {string} params.recepteurCollection - Nom de la collection du récepteur.
 * @param {string} params.recepteurId - UID du récepteur.
 * @returns {Promise<Array>} Liste des plaintes avec détails.
 */

function convertTimestamp(timestamp) {
	let date = timestamp.toDate();
	let mm = date.getMonth();
	let dd = date.getDate();
	let yyyy = date.getFullYear();

	date = dd + '/' + mm + '/' + yyyy;
	return date;
}

export const Envoyerreponse = async ({ message,id }) => {
  try{
    const reponsecoll = doc(db, 'Plaintes',id);
    return updateDoc(reponsecoll,{
      reponse:message,
    })
  }
  catch(error){
  
  }
}
export const Recupererplaintes = async ( { id }) => {

  const doc2=  await getDoc(doc(db, "Plaintes", id));
  return doc2.data();

}
export const Afficherplaintes = async ({ recepteurCollection, recepteurId }) => {
  try {
    // Référence à la collection "Plaintes"
    const plaintesColl = collection(db, "Plaintes");
    
    // Création de la requête pour filtrer les plaintes selon le récepteur
    const plaintesQuery = query(
      plaintesColl,
      where("recepteurCollection", "==", recepteurCollection),
      where("recepteurId", "==", recepteurId)
    );

    // Exécution de la requête
    const querySnapshot = await getDocs(plaintesQuery);

    // Transformation des données en un tableau d'objets
    const plaintes = await Promise.all(querySnapshot.docs.map(async doc => {
      const data = doc.data();
      const id = doc.id;
      
     
      // Attente de la résolution de infoclient1
      const info = await infoclient1({ nomcollection: data.emetteurCollection, idclient: data.emetteurId });
      const imagesHTML = data.fichierJoint
      .map(item => `<img src="${item}" alt="Description de l'image" style="width: 100%; max-width: 200px;" />`)
      .join(''); // Joindre les balises sans séparateurs
      // Extraction des données de la plainte
      const plainte =  {
       
        title: data.objet || "Pas de titre disponible",
        content: `
          <div style="width:100%; display: flex; gap: 20px; justify-content: space-between;"> 
            <div style="flex:1;"> 
              <p>Nom : <span id="nom-personne">${info.nom}</span></p>
              <p>Date : <span id="date"></span> ${convertTimestamp(data.created_at)} <span id="heure"></span></p>
              <br/>
              <br/><br/>
              <p>
              ${data.description}
              </p>
              <br/><br/>
              <a href="/facture/${data.liaisonId}" class="btn btn-primary" target="_blank" style="margin-top: 20px;">
                  voir dévis
              </a>
          
            </div> 
            <div class="image-container" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between; flex:1;">
            ${imagesHTML}
             
            </div>
          </div>
        `,
  
      };
      if (!data.reponse) {
        plainte.idrequete = id;
    }

    return plainte;
    }));
   
    return plaintes;

  } catch (error) {
    console.error("Erreur lors de la récupération des données des plaintes :", error);
    return [];
  }
};
