import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseconfig";
import {
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  getCountFromServer,
  or,
  and
} from "firebase/firestore";


/**************************permet de verifier si une date existe deja dans le calendrier */
export const verifyDate = async({dateverify,id}) => {
  try {
   
    const date = query(
      collection(db, "Calendrier"),
      and(where("id", "==", id),
      or(where("start", "==", dateverify), where("end", "==", dateverify))
    ));
    const snapshot1 = await getCountFromServer(date);
    
    const count1 = snapshot1.data().count;
    
    return count1 
  } catch (error) {
    console.log(error)
  }
}

export const allDate = async({id}) => {
  try {
    const date = query(
      collection(db, "Calendrier"),
      where("id", "==", id),
    
    );
    const querySnapshot = await getDocs(date);
    const datereturn = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

   
    return datereturn
  } catch (error) {
    console.log(error)
  }
}

/**permet de compter le nombre d'evenement qu'une personne a dans son calendrier */
export const countEvent = async ({ id }) => {
    try {
      const date = query(
        collection(db, "Calendrier"),
        where("id", "==", id)
      );
      const snapshot1 = await getCountFromServer(date);
      const count1 = snapshot1.data().count;
      return count1
    } catch (error) {
      console.log(error)
    }
  }
  
  /*******fonction qui ajoute les notifications de rappel d'evement */
  
  export const notificationdate = async ({ id }) => {
    try {
      // on recupere tous les evenements de l'entreprise
      const date = query(
        collection(db, "Calendrier"),
        where("id", "==", id)
      );
  
      const querySnapshot = await getDocs(date);
      const notificationdate = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      notificationdate.forEach(async (date) => {
        
        const datecalen = new Date(date.start.seconds * 1000)// la date de debut de chaque evenement converti en milliseconde
        const dateactuelle = new Date()//la date actuelle
  
        //pour toutes les dates superieures au date actuelle on effectue la difference
        if (datecalen > dateactuelle) {
          const diff = (datecalen - dateactuelle) / (1000 * 60 * 60)
  
          // si la condition verifiee ,on cree une nouvelle notification et on ajoute un nouvel attribut dans ces evenements
          if (diff >= 1 && diff <= 24 && !date.notifenvoye) {
            
            const notificationRef = doc(db, "Calendrier", date.idcalendrier)
  
            await updateDoc(notificationRef, {
              notifenvoye: true,
            });
  
            const notifEnvoye = collection(db, "notificationQuincaillerie");
  
            await addDoc(notifEnvoye, {
              message: `N'oubliez pas votre rdv du ${new Date((date.start.seconds*1000)).toLocaleDateString()}`,
              type: "agenda",
              titre: `Rappel d'evenement`,
              etat: false,
              technicienuid: auth.currentUser.uid,
              idnotif: notifEnvoye.id,
              lien:'calender'
            });
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

 