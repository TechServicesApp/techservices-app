import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useLoginMutation } from "@/store/api/auth/authApiSlice";
import { toast } from "react-toastify";
import {db } from "@/firebaseconfig";
import InputGroup from "@/components/ui/InputGroup";

import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
const schema = yup
  .object({
    nom: yup.string().required("veuillez remplir"),

    // montant: yup.number().required("veuillez remplir"),
    phone: yup
      .string()
      .required("Veuillez remplir")
      .matches(/^[0-9]{9}$/, "Telephone invalide"),
  })
  .required();
const FormulairePaiement = () => {
  const [{ isLoading  }] = useLoginMutation();
  const [value, setValue] = useState("MOMO");
  const [nom, setnom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [data, setData] = useState([]);
  const [montantPrevu, setmontantPrevu] = useState(0);



  const options = [
    {
      value: "MOMO",
      label: "MOMO",
    },
    {
      value: "OM",
      label: "OM",
    },
   
  ];

  const navigate = useNavigate();
  const paiementquincailler = collection(db, "paiementQuincailer");
  const quincaillerieDevis =  doc(db, "DevisQuincailler", localStorage.getItem("id"))

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });

  useEffect(() => {
    afficherdevis();
  }, []);

  const afficherdevis = async () => {
    const doc2 = await getDoc(
      doc(db, "DevisQuincailler", localStorage.getItem("id"))
    );
    setData(doc2.data());
    setmontantPrevu(doc2.data().prixLivraison + doc2.data().totalTtc);

   
  };

  const onSubmit = async (e) => {
    try {
      await updateDoc( quincaillerieDevis,{
        etat:2
       })
      
        await addDoc(paiementquincailler, {
          nomBeneficiaire: nom,
          telephoneBeneficiaire: parseInt(telephone),
          moyenPaiement: value,
          quincailleruid: data.quincailleruid,
          technicienId: data.technicienId,
          besoinId: (data.besoinId===null)?(null):(data.besoinId),
          devisQuincaillerId: data.Id,
          date_created: new Date(),
          montantPrevu: montantPrevu,
          etatPaiement:0,
          date: format(new Date(), "dd/MM/yyyy"),
          
        }).then(() => {
          toast.success("envoyé avec success");
          navigate("/crm");
        });
       
   
}
   catch (error) {
       console.log(error.code)
      };
    }


  const handleChange = (e) => {
    setValue(e.target.value);
    
  };

  return (
    <div className=" d-flex flex-direction-column" >
      <div >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
          <Select
            label="Moyen de paiement"
            options={options}
            onChange={handleChange}
            value={value}
            horizontal
            placeholder="paiement"
          />

          <InputGroup
            className="row"
            label="Telephone beneficiaire"
            type="text"
            prepend="+237"
            placeholder="numero de telephone"
            name="phone"
            error={errors.phone}
            register={register}
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />

          <Textinput
            name="montant"
            label="montant"
            placeholder={montantPrevu}
            type="text"
            value={montantPrevu}
            readonly
            // onChange={(e) => setmontant(e.target.value)}
             register={register}
            // error={errors.montant}
            className="h-[48px]"
          />
          <Textinput
            name="nom"
            label="Nom beneficiaire"
            placeholder="nom"
            type="text"
            value={nom}
            onChange={(e) => setnom(e.target.value)}
            register={register}
            error={errors.nom}
            className="h-[48px]"
          />

          <Button
            type="submit"
            text="Envoyer"
            className="btn btn-info  text-center "
            isLoading={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default FormulairePaiement;
