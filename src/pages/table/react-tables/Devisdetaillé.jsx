import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseconfig";
import { useParams } from "react-router-dom";

const DevisDetail = () => {
  const { id } = useParams();
  const [selectedDevis, setSelectedDevis] = useState(null);

  useEffect(() => {
    const fetchDevisDetails = async () => {
      const devisDoc = doc(db, "Quincaillerie", id);
      const devisData = await getDoc(devisDoc);
      if (devisData.exists()) {
        setSelectedDevis({ id: id, ...devisData.data() });
      } else {
        console.log("No such document!");
      }
    };

    fetchDevisDetails();
  }, [id]);

  if (!selectedDevis) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">{selectedDevis.nom}</h2>
      <iframe
        src={selectedDevis.doc1}
        width="100%"
        height="600px"
        style={{ border: "none", marginTop: "50px", width: "100%" }}
        title="PDF Viewer"
      ></iframe>
    </div>
  );
};

export default DevisDetail;
