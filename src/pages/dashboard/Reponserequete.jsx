import React, { useState, useMemo } from "react";
import { auth, db, imgdb } from "@/firebaseconfig";
import userDarkMode from "@/hooks/useDarkMode";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { collection, where, query, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { infoclient1, infoquincailler } from "./InfoClient";
import {
  Recupererplaintes,
  Envoyerreponse,
} from "./fonctions/fonctionsrequetes";
import Textarea from "@/components/ui/Textarea";

const schema = yup
  .object({
    message: yup.string().required("Le message est obligatoire"),
  })
  .required();
const Reponserequete = () => {
  const { id } = useParams();
  const [plainte, setplainte] = useState([]);
  const [client, setclient] = useState();
  const [quincailler, setquincailler] = useState();
  const navigate = useNavigate();

  const fetchPost = async () => {
    const plainterecupere = await Recupererplaintes({ id: id });
    setplainte(plainterecupere);

    const info = await infoclient1({
      nomcollection: plainterecupere.emetteurCollection,
      idclient: plainterecupere.emetteurId,
    });
    setclient(info);

    const quincaillerr = await infoquincailler({
      nomcollection: "Quincaillerie",
      idclient: auth.currentUser.uid,
    });
    setquincailler(quincaillerr);
  };
  const onSubmit = async (data, e) => {
    try{

    await Envoyerreponse({
      message: data.message,
      recepteurCollection: plainte.emetteurCollection,
      recepteurId: plainte.emetteurId,
      emetteurCollection: "Quincaillerie",
      emetteurId: auth.currentUser.uid,
      liaisonCollection: plainte.liaisonCollection,
      liaisonId: plainte.liaisonId,
    }).then(() => {
        toast.success("Envoyé avec success");
        navigate("/crm");
    })
    }
    catch(error){
        console.log(error)
    }
  };
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
    fetchPost();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
        <Textinput
          name="email"
          readonly
          label="A"
          placeholder={client?.nom}
          type="text"
          register={register}
          className="h-[48px]"
        />

        <Textinput
          name="email"
          readonly
          label="DE"
          placeholder={quincailler?.nom}
          type="text"
          register={register}
          className="h-[48px]"
        />
        <Textinput
          name="email"
          label="Objet"
          placeholder={plainte.objet}
          type="text"
          register={register}
          readonly
          className="h-[48px]"
        />

        <Textarea
          label="Description"
          readonly
          id="pn4"
          placeholder={plainte.description}
          row="5"
        />
        <Textarea
          label="Message"
          placeholder="Write Your Message"
          name="message"
          register={register}
          error={errors.message}
          row="5"
        />

        <Button
          type="submit"
          text="Envoyer"
          className="bg-blue-500 block w-full text-center "
        />
      </form>
    </div>
  );
};

export default Reponserequete;
