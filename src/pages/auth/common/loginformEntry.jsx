import React ,{useEffect} from "react";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "@/firebaseconfig";
import { collection, where, query, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const LoginForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const currentUserId = user.uid;
          const idService = localStorage.getItem("idservice");

          const services = {
            "uX2Xg5nHLJTz8JsEAWiz": { collection: "Quincaillerie", navigateTo: "/crm" },
            "21xHEmO1HQC4Hst4QNup": { collection: "Architecture", navigateTo: "/architecture_devis" },
            "5rUVXFsgMNr2lTQebSKa": { collection: "BureaudEtudeBTP", navigateTo: "/demandedevis" },
            "dlJINMSa04nPdbhH56Oy": { collection: "EntrepriseBtp", navigateTo: "/devis_en_attente" },
          };

          if (idService in services) {
            const { collection: collectionName, navigateTo } = services[idService];
            const q = query(collection(db, collectionName), where("uid", "==", currentUserId));
            const querySnapshot = await getDocs(q);

            let categoryFound = false;
            let status, reason;

            querySnapshot.forEach((doc) => {
              localStorage.setItem("quincailler", doc.id);

              if (doc.data()?.idservice === idService) {
                categoryFound = true;
                status = doc.data()?.validationStatus;
                reason = doc.data()?.reason;
              }
            });

            if (categoryFound) {
              if (status === 2) {
                toast.error(`Connexion refusée : ${reason}`);
              } else {
                toast.success("Redirection vers votre espace...");
                navigate(navigateTo);
              }
            }
          }
        }
      });
    };

    checkAuth();
}, [navigate]);
  return (
    <div>
      {/* <Button
        text="CABINET D'ARCHITECTURE"
        className="btn-secondary block-btn text-center "
      />
      <br/>
      <Button
        text="LABORATOIRE GEOTECHNIQUE"
        className="btn-secondary block-btn text-center "
      />
 */}
   <Button
        text="ARCHITECTURE"
        className="bg-blue-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded block-btn text-center"
        onClick={() => {
          localStorage.setItem("idservice", "21xHEmO1HQC4Hst4QNup");
          localStorage.setItem("collectionservice", "Globalserviceweb");
          navigate("/login");
        }}
      />
      <br />
      <Button
        text="BUREAU D'ETUDE BTP"
        className="bg-blue-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded block-btn text-center"
        onClick={() => {
          localStorage.setItem("idservice", "5rUVXFsgMNr2lTQebSKa");
          localStorage.setItem("collectionservice", "Globalserviceweb");
          navigate("/login");
        }}
      />
 <br/> 

      <Button
        text="ENTREPRISE BTP"
        className="bg-blue-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded block-btn text-center"
        onClick={() => {
          localStorage.setItem("idservice", "dlJINMSa04nPdbhH56Oy");
          localStorage.setItem("collectionservice", "Globalserviceweb");
          navigate("/login");
        }}
      />

 <br/> 
      <Button
        text="QUINCAILLERIE"
        className="bg-blue-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded block-btn text-center "
        onClick={() => {
          localStorage.setItem("idservice", "uX2Xg5nHLJTz8JsEAWiz");
          localStorage.setItem("collectionservice", "Globalserviceweb");
          navigate("/login");
        }}
      />
    </div>
  );
};

export default LoginForm;
