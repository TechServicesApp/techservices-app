import { collection, addDoc } from "firebase/firestore";
import {db } from "@/firebaseconfig";
import { toast } from "react-toastify";

export const envoiBon = async ({
  adresse,
  items,
  senderid,
  sendercollection,
  titre,
  type,
}) => {
  try {
    const devis = collection(db, "Devis");
    await addDoc(devis, {
      adresse: adresse,
      creationDate: new Date(),
      items: items,
      public: true,
      senderId: senderid,
      sendercollection: sendercollection,
      titre: titre,
      type: "demande",
      typeQuincaillerie: type,
    }).then(() => {
      toast.success("Bon envoyé avec success");
    });
  } catch (error) {
    console.log(error);
  }
};
