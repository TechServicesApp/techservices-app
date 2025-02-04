import React, { Fragment, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, imgdb } from "@/firebaseconfig";
import { useEffect } from "react";
import { annonceUnique, publierCv } from "./fonctions/Fonctionsannonces";
import { cvRecrutement } from "./fonctions/Fonctionsannonces";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Fileinput from "@/components/ui/Fileinput";
import { v4 } from "uuid";
import { toast } from "react-toastify";


const ProductDetails = () => {
  let { id } = useParams();
  const [data, setdata] = useState([]);
  const [cv,setCv] = useState([]);
  const [logo, setLogo] = useState("");
const [cvenvoye,setCvenvoye]= useState(true)
  const [selectedFile2, setSelectedFile2] = useState(null);
  const navigate = useNavigate();

  const handleUpload2 = (e) => {
    setSelectedFile2(e.target.files[0]);
    const reflogo = ref(
      imgdb,
      `CVs/${new Date().getTime() + v4()}`
    );
    uploadBytes(reflogo, e.target.files[0]).then((snapshot2) => {
      getDownloadURL(snapshot2.ref).then((url2) => {
        setLogo(url2);
      });
    });
  };

  

  useEffect(() => {
    const fetch = async () => {
      const data = await annonceUnique({ id: id });
      setdata(data);
      const cv = await cvRecrutement({ annonceid: data.id });
      setCv(cv);
     
        const besoinFound = cv.some(
          (cvdetail) =>{
           
            cvdetail.technicienUID === auth.currentUser.uid}
        );
    
        if (!besoinFound) {setCvenvoye(false)}
    };

    fetch();

    // Appel de la fonction async définie dans useEffect
  }, []); // Ajout de la dépendance "id"

  return (
    <>
      <div className="w-full bg-white dark:bg-slate-800 p-6 rounded-lg">
        <div className="pb-5">
          <div className="flex items-center pb-4">
            <div className="ltr:mr-[10px] rtl:ml-[10px]">
              <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
                <img
                  src={data?.devisInfo?.logo || data?.devisInfo?.picture}
                  alt=""
                  className="block w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex text-ellipsis whitespace-nowrap">
              <span className="text-ellipsis whitespace-nowrap w-[85px] block">
                {data?.devisInfo?.nom}
              </span>
            </div>
          </div>

          <br />
          <div className="grid grid-cols-12  md:space-x-6 md:space-y-0 space-y-4 sm:space-y-4  rtl:space-x-reverse ">
            <div className=" col-span-12 md:col-span-5 lg:col-span-4 space-y-4 ">
              {data.typeFichier === "image" ? (
                <img className="h-full w-full" src={data.fichier} alt="media" />
              ) : (
                <video className="h-full w-full" controls>
                  <source src={data.fichier} />
                </video>
              )}
            </div>
            <div className="col-span-12 md:col-span-7 lg:col-span-8 space-y-2 ">
              <div className="space-y-2">
                <h1 className="text-slate-900 dark:text-slate-300 text-xl lg:text-2xl font-medium ">
                  {data.titre}
                </h1>

                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <p className="font-normal text-sm lg:text-base text-slate-500 dark:text-slate-400 ">
                    {data.description}
                  </p>
                  <p className="font-medium text-sm lg:text-base text-slate-900 dark:text-slate-300 "></p>
                </div>
                <br />
                <div className="flex justify-between items-center pt-2">
                  <p className="text-xs text-slate-900 dark:text-slate-300 uppercase font-normal">
                    {data?.updated_at && data?.updated_at.seconds
                      ? new Date(
                          data?.updated_at.seconds * 1000
                        ).toLocaleDateString()
                      : "Date non disponible"}
                  </p>

                  <span className="flex items-center text-slate-900 dark:text-slate-300 font-normal text-xs space-x-1 rtl:space-x-reverse">
                    <span>
                      {data?.devisInfo?.localisation ||
                        data?.devisInfo?.adresse}
                    </span>
                  </span>
                </div>
                <p className="font-normal text-sm lg:text-base text-slate-500 dark:text-slate-400"></p>
              </div>
            </div>
          </div>
        </div>
        {data?.auteurID != auth.currentUser.uid && data?.typeAnnonce==="Recrutement" && cvenvoye===false && (
          <Modal
            title="Envoyer un cv"
            label="Envoyer un CV"
            labelClass="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-green-200 dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
            uncontrol
            onClose={()=>{setLogo("")}}
          >
            <div className="text-base text-slate-600 dark:text-slate-300">
              <form>
                <Fileinput
                  name="cv"
                  label="CV"
                  selectedFile={selectedFile2}
                  accept=".pdf"
                  placeholder="Choisir un fichier"
                  onChange={(e) => {
                    handleUpload2(e);
                  }}
                  required
                />

                {logo !== "" && (
                  <Button
                    onClick={async () => {
                      try {
                        await publierCv({
                          idannonce:id,
                          collection1:localStorage.getItem("idservice") === "uX2Xg5nHLJTz8JsEAWiz"?("Quincaillerie"):("EntrepriseBtp"),
                          cv:logo,
                          entrepriseid:data.auteurID,
                          technicienUID:auth.currentUser.uid
                        })
                        toast.success("CV envoyé avec succès");
                        setLogo("");
                        setCvenvoye(true)
                        
                      } catch (error) {
                        console.error(
                          "Erreur lors de la publication du cv : ",
                          error
                        );
                      }
                    }}
                  >
                    Publier
                  </Button>
                )}
              
              </form>
            </div>
          </Modal>
        )}
        {cv.length > 0 && data.auteurID === auth.currentUser.uid && data.typeAnnonce==="Recrutement" && (
          <div className="border border-1 dark:border-slate-700 rounded p-6">
            <h6 className="text-slate-900 dark:text-slate-300 pb-6 text-lg lg:text-xl">
              CV
            </h6>
            <div className="space-y-12">
              {cv.map((item, i) => (
                <div className="flex space-x-3 rtl:space-x-reverse ">
                  <div className=" h-14 w-14 rounded-full object-cover bg-white ring-1 overflow-hidden flex-none">
                    <img
                      className="h-full w-full object-contain"
                      src={item?.devisInfo?.logo || item?.devisInfo?.picture}
                    />
                  </div>
                  <div>
                    {" "}
                    <div>
                      <p className="text-slate-900  dark:text-slate-300 font-medium text-sm lg:text-base pb-1">
                        {item?.devisInfo?.nom}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 font-normal text-xs  pb-1">
                        {item.date && item.date.seconds
                          ? new Date(
                              item.date.seconds * 1000
                            ).toLocaleDateString()
                          : "Date non disponible"}
                      </p>
                    </div>
                    <a target="_blank"   href={item.cvUrl}>
                      Telecharger pdf
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default ProductDetails;
