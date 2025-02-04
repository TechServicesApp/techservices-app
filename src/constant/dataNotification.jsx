import React , { useState, useMemo, useEffect } from 'react'
import { auth, db, imgdb } from "@/firebaseconfig";
import {
  collection,
  getDocs,
  where,
  getCountFromServer,
  query,
  doc,
} from "firebase/firestore";

import User1 from "@/assets/images/all-img/c1.png"
import User2 from "@/assets/images/all-img/c1.png"
import User3 from "@/assets/images/all-img/c1.png"
import User4 from "@/assets/images/all-img/c1.png"

export const notifications = [
  // {
  //   title: "Your order is placed",
  //   desc: "Amet minim mollit non deser unt ullamco est sit aliqua.",

  //   image: User1,
  //   link: "#",
  // },
  // {
  //   title: "Congratulations Darlene  🎉",
  //   desc: "Won the monthly best seller badge",
  //   unread: false,
  //   image: User2,
  //   link: "#",
  // },
  // {
  //   title: "Revised Order 👋",
  //   desc: "Won the monthly best seller badge",

  //   image: User3,
  //   link: "#",
  // },
  // {
  //   title: "Brooklyn Simmons",
  //   desc: "Added you to Top Secret Project group...",

  //   image: User4,
  //   link: "#",
  // },
];
const  dataNotification = () =>{

  useEffect(() => {
    fetchPost();
  }, []);

  const [bonCommande,setBoncommande] = useState([])
  const fetchPost = async () => {
    const bonCommande = query(
      collection(db, "Devis"),
      where("public", "==", true)
    );
    const devisSnapshot = await getDocs(bonCommande);
    const devisData = devisSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: "nouveau Devis",
      desc: "Added you to Top Secret Project group...",
      image: User4,
      link: "#",
    }));
  
    setBoncommande(devisData)
    notifications.push(devisData)
  }

 

  return (
    <div>dataNotification</div>
  )
}

export default dataNotification