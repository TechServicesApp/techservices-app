import React, { useState } from "react";
import { auth, db } from "@/firebaseconfig";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { useParams } from "react-router-dom";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  deleteDoc
} from "firebase/firestore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { infoclient } from "./InfoClient";
import { Notificationid } from "@/fonctionnotification";
import { toast } from "react-toastify";

const Visualisation = () => {
  const {id} = useParams()
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [data, setData] = useState([]);
  const [nomTechni, setnomTechni] = useState("");
  const [emailTechni, setemailTechni] = useState("");
  const [telTechni, settelTechni] = useState("");
  const [adresseTechni, setadressetelTechni] = useState("");
  const [nomquin, setnomquin] = useState("");
  const [logo, setlogo] = useState("");
  const [emailquin, setemailquin] = useState("");
  const [telquin, settelquin] = useState("");
  const [adressequin, setadressequin] = useState("");
  const [specialitequincailler, setspecialitequincailler] = useState("")

  const naviguer = () => {
    navigate(`/Edition_Facture/${id}`);
  };

  const annuler = async ({ id, coll }) => {

    await deleteDoc(doc(db, coll, id)).then(async () => {
     toast.success("supprimé avec success"), navigate("/crm") 
    });

  }
  const printPage = () => {
    const printContent = document.getElementById("printableArea").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  const fetchPost = async () => {
    const doc2 = await getDoc(
      doc(db, "DevisQuincailler", id)
    );

    const data1 = doc2.data();

    setData(data1);

    const q1 = query(
      collection(db, "Quincaillerie"),
      where("uid", "==", auth.currentUser.uid)
    );

    const querySnapshot1 = await getDocs(q1);

    querySnapshot1.forEach((doc) => {
      setnomquin(doc.data()?.nom);
      setemailquin(doc.data()?.email);
      settelquin(doc.data()?.telephone);
      setadressequin(doc.data()?.localisation);
      setlogo(doc.data()?.logo);
      const idspecialiteValues = Array.isArray(doc.data().idspecialite)
      ? doc.data().idspecialite.map(obj => obj.label)
      : [doc.data().idspecialite.label];
      setspecialitequincailler(idspecialiteValues.join(", "))
    });

   const info = await infoclient({nomcollection:data1.sendercollection,idclient:data1.senderId});

   
    setnomTechni(info.nom);
    setemailTechni(info.email);
    settelTechni(info.telephone);
    setadressetelTechni(info.adresse);

    const modifiedData = data1.items.map((item, index) => {
      return { ...item };
    });
    setProducts(modifiedData);
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <>
      <div translate="no">
        <div className="lg:flex justify-between flex-wrap items-center mb-6">
          <h4 className="text-[#067BBF]">Facture</h4>
          <div className="flex lg:justify-end items-center flex-wrap space-xy-5">
            <button
              type="button"
              onClick={naviguer}
              className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
            >
              <span className="text-lg">
                <Icon icon="heroicons:pencil-square" />
              </span>
              <span translate="no">Editer</span>
            </button>
          </div>
        </div>
        <Card bodyClass="p-0">
          <div className="flex justify-between flex-wrap space-y-4 px-6 pt-6 bg-slate-50 dark:bg-slate-800 pb-6 rounded-t-md">
            <div>
              <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
                <img
                  src={logo}
                  alt=""
                  className="block w-full h-full object-cover rounded-full"
                />
              </div>

              <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 mt-4 text-sm">
                {nomquin} <br />
                {adressequin} <br />
                <div className="flex space-x-2 mt-2 leading-[1] rtl:space-x-reverse">
                  <Icon icon="heroicons-outline:phone" />
                  <span>{telquin}</span>
                </div>
                <div className="mt-[6px] flex space-x-2 leading-[1] rtl:space-x-reverse">
                  <Icon icon="heroicons-outline:mail" />
                  <span>{emailquin}</span>
                </div>
                <div className="mt-[6px] flex space-x-2 leading-[1] rtl:space-x-reverse">
                  <Icon icon="heroicons-outline:mail" />
                  <span>{specialitequincailler}</span>
                </div>
              </div>
            </div>
            <div>
              <span className="block text-slate-900 dark:text-slate-300 font-medium leading-5 text-xl">
                Destinataire:
              </span>

              <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 mt-4 text-sm">
                {nomTechni} <br />
                {adresseTechni} <br />
                <div className="flex space-x-2 mt-2 leading-[1] rtl:space-x-reverse">
                  <Icon icon="heroicons-outline:phone" />
                  <span>{telTechni}</span>
                </div>
                <div className="mt-[6px] flex space-x-2 leading-[1] rtl:space-x-reverse">
                  <Icon icon="heroicons-outline:mail" />
                  <span>{emailTechni}</span>
                </div>
              </div>
            </div>
            <div className="space-y-[2px]">
              <span className="block text-slate-900 dark:text-slate-300 font-medium leading-5 text-xl mb-4">
                Devis:
              </span>
              <h4 className="text-slate-600 font-medium dark:text-slate-300 text-xs uppercase">
                Numero Devis:
              </h4>
              <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 text-sm">
                {data.matriculeDevis}
              </div>
              <h4 className="text-slate-600 font-medium dark:text-slate-300 text-xs uppercase">
                date
              </h4>
              <div className="text-slate-500 dark:text-slate-300 font-normal leading-5 text-sm">
                {data.date}
              </div>
            </div>
          </div>
          <div className="max-w-[980px] mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
            <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
              <thead>
                <tr>
                  <th
                    colSpan={3}
                    className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left"
                  >
                    <span className="block px-6 py-5 font-semibold">
                      PRODUIT
                    </span>
                  </th>
                  <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
                    <span className="block px-6 py-5 font-semibold">QTe</span>
                  </th>
                  <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
                    <span className="block px-6 py-5 font-semibold">PRIX</span>
                  </th>
                  <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
                    <span className="block px-6 py-5 font-semibold">UNIT</span>
                  </th>
                  <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
                    <span className="block px-6 py-5 font-semibold">TOTAL</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                {products.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100 dark:border-slate-700"
                  >
                    <td
                      colSpan={3}
                      className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4"
                    >
                      {row.designation}
                    </td>
                    <td className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                      {row.qte}
                    </td>
                    <td className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                      {row.unite}
                    </td>

                    <td className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                      {row.pu}
                    </td>
                    <td className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                      {row.pt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:flex px-6 py-6 items-center">
            <div className="flex-1 text-slate-500 dark:text-slate-300 text-sm"></div>
            <div className="flex-none min-w-[270px] space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
                  Total Ht:
                </span>
                <span className="text-slate-900 dark:text-slate-300">
                  {data.totalHt} XAF
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
                  Tva (19,25%):
                </span>
                <span className="text-slate-900 dark:text-slate-300">
                  {data.Tva} XAF
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
                  Total Ttc:
                </span>
                <span className="text-slate-900 dark:text-slate-300 font-bold">
                  {data.totalTtc} XAF
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
                  Prix Livraison:
                </span>
                <span className="text-slate-900 dark:text-slate-300 font-bold">
                  {data.prixLivraison} XAF
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
                  Net a payer:
                </span>
                <span className="text-slate-900 dark:text-slate-300 font-bold">
                  {data.prixLivraison + data.totalTtc} XAF
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
                  Delai de livraison
                </span>
                <span className="text-slate-900 dark:text-slate-300 font-bold">
                  {data.nbreJoursLivraison} Heures
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
                  Jours de garantie
                </span>
                <span className="text-slate-900 dark:text-slate-300 font-bold">
                  {data.nbreJoursGarantie} Jours
                </span>
              </div>
            </div>
          </div>
        </Card>
        <br/>
        <button
                  className="invocie-btn text-white inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-[#067BBF] dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-bold text-slate-900 rtl:space-x-reverse"
                  onClick={async () => {
                    await annuler({ id: id, coll: "DevisQuincailler" });
                  }}
                >
                  Annuler la proforma
                </button>
      </div>
    </>
  );
};

export default Visualisation;
