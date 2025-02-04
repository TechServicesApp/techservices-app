
import { collection } from "firebase/firestore";
import { auth, db } from "@/firebaseconfig";
import {
  getDocs,
  query,
  where,
} from "firebase/firestore";


//recuperer toutes les notifications lues et non lues
export const notificationentreprise = async () => {
  try {
    const notificationQuincaillerieQuery = query(
      collection(db, "notificationQuincaillerie"),
      where("technicienuid", "==", auth.currentUser.uid),
      
    );
    const notifquincaillerieSnapshot = await getDocs(
      notificationQuincaillerieQuery
    );
    const notificationQuincaillerieData = notifquincaillerieSnapshot.docs.map(
      (doc) => doc.data()
    );

    return notificationQuincaillerieData
  } catch (error) {
    console.log(error)
  }
}

//recuperer toutes les notifications non lues
export const notificationentreprisefalse = async () => {
  try {
    const notificationQuincaillerieQuery = query(
      collection(db, "notificationQuincaillerie"),
      where("technicienuid", "==", auth.currentUser.uid),
      where("etat","==",false)
      
    );
    const notifquincaillerieSnapshot = await getDocs(
      notificationQuincaillerieQuery
    );
    const notificationQuincaillerieData = notifquincaillerieSnapshot.docs.map(
      (doc) => doc.data()
    );

   
    return notificationQuincaillerieData
  } catch (error) {
    console.log(error)
  }
}