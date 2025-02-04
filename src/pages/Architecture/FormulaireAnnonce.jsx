import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Fileinput from "@/components/ui/Fileinput";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Ajoutannonce, Afficherannonce } from "@/pages/EntreprisBTP/fonctions/Fonctionsannonces";
import { v4 } from "uuid";
import Select from "@/components/ui/Select";
import { optiontype, optionfichier } from "./fonctions/dataAnnonce";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { collection,query,where,getDocs } from "firebase/firestore";
import { auth, db, imgdb } from "@/firebaseconfig";
const Annonce = () => {
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [logo, setLogo] = useState("");
  const [posts, setPosts] = useState([]);
  const [value, setValue] = useState("Formation");
  const [value2, setValue2] = useState("video");
  const navigate= useNavigate()

  const FormValidationSchema = yup
    .object({
      titre: yup.string().required("Titre obligatoire"),
      description: yup.string().required("Description obligatoire"),
    })
    .required();

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleChange2 = (e) => {
    setValue2(e.target.value);
  };
  useEffect(() => {
    const add = async () => {
      const a = await Afficherannonce({ id: auth.currentUser.uid });
      setPosts(a);
    };

    add();

    const interval = setInterval(() => {
      add();
    }, 50000); // 5 secondes en millisecondes

    // Nettoyage de l'intervalle lorsque le composant est démonté ou rechargé
    return () => clearInterval(interval);
  }, []);


  const handleUpload2 = (e) => {
    setLogo("")
    setSelectedFile2(e.target.files[0]);
    const reflogo = ref(
      imgdb,
      `annoncearchi/${new Date().getTime() + v4()}`
    );
    uploadBytes(reflogo, e.target.files[0]).then((snapshot2) => {
      getDownloadURL(snapshot2.ref).then((url2) => {
        setLogo(url2);
      });
    });
  };

  const onSubmit = async (data) => {
    try {
      const q1 = query(
        collection(db, "Architecture"),
        where("uid", "==", auth.currentUser.uid)
      );

      const querySnapshot1 = await getDocs(q1);
let lien;
let nom;
      querySnapshot1.forEach((doc) => {
        lien = doc.data()?.logo;
        nom = doc.data()?.nom
      })
  
      await Ajoutannonce({
        auteur: "Architecture",
        id: auth.currentUser.uid,
        cible: null,
        fichier: logo,
        titre:data?.titre,
        description:data?.description,
        typeAnnonce:value,
        typeFichier:value2,
        statut: 1,
        nameAuteur : nom,
logo :lien
        
      }).then(()=>{
         console.log("Annonce publiée avec succès");
         toast.success("Annonce publiée avec succès")
         navigate("/annonce")
        })
     
    } catch (error) {
      console.error("Erreur lors de la publication de l'annonce : ", error);
    }
  };
  return (
    <div className="space-y-5 divide-y divide-slate-100 dark:divide-slate-700 -mx-6">
     
     
        <div className=" pr-10 pl-10">
         
           
             
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Select
                    label="Type annonce"
                    options={optiontype}
                    onChange={handleChange}
                    value={value}
                  />
                  <br />
                  <Select
                    label="Type fichier"
                    options={optionfichier}
                    onChange={handleChange2}
                    value={value2}
                  />
                  <br />
                  <Textinput
                    name="titre"
                    label="Titre"
                    type="text"
                    placeholder="Entrer le titre"
                    register={register}
                    error={errors.titre}
                  />
                  <br />
                  <Textarea
                    name="description"
                    label="Description"
                    type="text"
                    placeholder="entrer la description"
                    register={register}
                    error={errors.description}
                  />
                  <br />
                  <Fileinput
                    name="logo"
                    label="Fichier"
                    selectedFile={selectedFile2}
                    preview
                    accept={`${value2}/*`}
                    placeholder="Choisir un fichier"
                    onChange={(e) => {
                      handleUpload2(e);
                    }}
                    required
                    {...(value2 === "video" && { type: "video" })}
                  />

                  {logo !== "" && <Button type="submit">Publier</Button>}
                </form>
             
           
     
         
        
      </div>
    </div>
  );
};

export default Annonce;
