import {
    collection,
    getDocs,
    where,
    query,
    getDoc,
    doc
} from "firebase/firestore";
import { auth, db, imgdb } from "@/firebaseconfig";

export const bonCommande = async () => {

    const docRef = doc(db, "Quincaillerie", localStorage.getItem("quincailler"));
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
  
      // Récupère le tableau d'objets et extrait les valeurs de l'attribut `value`
      const idspecialiteValues = Array.isArray(data.idspecialite)
      ? data.idspecialite.map(obj => obj.value )
      : [data.idspecialite.value];

      // Vérifie si "generale" est présent dans les valeurs de `idspecialite`
      const hasGenerale = idspecialiteValues.includes("uUzMTtl3Q7S7MLN95sVp");
    
      // Déclare la requête selon la présence de "generale"
      let devisQuery;
    
      if (hasGenerale) {
        // Pas de filtre `typeQuincaillerie` si "generale" est présent
        devisQuery = query(
          collection(db, "Devis"),
          where("public", "==", true)
        );
      } else {
        // Applique le filtre `typeQuincaillerie` avec `idspecialiteValues`
        devisQuery = query(
          collection(db, "Devis"),
          where("public", "==", true),
          where("typeQuincaillerie", "in", [
            ...idspecialiteValues
          ])
        );
      }
      
    
    const devisSnapshot = await getDocs(devisQuery);
    const devisData = devisSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    const besoinQuincaillerieQuery = query(
        collection(db, "DevisQuincailler"),
        where("quincailleruid", "==", auth.currentUser.uid)
    );

    const besoinQuincaillerieSnapshot = await getDocs(besoinQuincaillerieQuery);
    const besoinQuincaillerieData = besoinQuincaillerieSnapshot.docs.map(
        (doc) => doc.data()
    );

    const filteredDevis = [];

    devisData.forEach((devis) => {
        const besoinFound = besoinQuincaillerieData.some(
            (besoinQuincaillerie) =>
              devis.type
            ?besoinQuincaillerie.besoinId === devis.id
            :besoinQuincaillerie.besoinId === devis.besioinId
        );

        if (!besoinFound) {
            filteredDevis.push(devis);
        }
    });

    return filteredDevis
}