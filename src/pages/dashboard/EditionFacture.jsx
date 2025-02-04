import React, { useState } from "react";
import { auth, db } from "@/firebaseconfig";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  collection,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { infoclient } from "./InfoClient";

const Visualisation = () => {

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [data, setData] = useState([]);
  const { id } = useParams()

  const [newInputValues, setNewInputValues] = useState({});
  const [nomTechni, setnomTechni] = useState("");
  const [emailTechni, setemailTechni] = useState("");
  const [telTechni, settelTechni] = useState("");
  const [adresseTechni, setadressetelTechni] = useState("");
  const [prixlivrai, setprixlivrai] = useState(0);
  const [nomquin, setnomquin] = useState("");
  const [logo, setlogo] = useState("");
  const [emailquin, setemailquin] = useState("");
  const [telquin, settelquin] = useState("");
  const [adressequin, setadressequin] = useState("");
  const [checked, setChecked] = useState(false);
  const [garantie, setgarantie] = useState(0);
  const [delai, setdelai] = useState(0);
  const [specialitequincailler, setspecialitequincailler] = useState("")
  const devisQuincailler = doc(
    db,
    "DevisQuincailler",
    id
  );

  const handleChange = () => {
    setChecked(!checked);
  };
  const fetchPost = async () => {

    const doc2 = await getDoc(
      doc(db, "DevisQuincailler", id)
    );

    const data1 = doc2.data();
    setprixlivrai(data1.prixLivraison);
    setdelai(data1.nbreJoursLivraison);
    setgarantie(data1.nbreJoursGarantie)
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

    const info = await infoclient({ nomcollection: data1.sendercollection, idclient: data1.senderId });

    setData(data1);
    
    setnomTechni(info.nom);
    setemailTechni(info.email);
    settelTechni(info.telephone);
    setadressetelTechni(info.adresse);

    const modifiedData = data1.items.map((item, index) => {
      return { ...item };
    });
    setProducts(modifiedData);
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;

    const updatedData = [...products];
    for (const rowId in newInputValues) {
      const updatedRow = {
        ...products.find((row, index) => index === rowId),
        ...newInputValues[rowId],
      };
      updatedData.push(updatedRow);
    }

    const mergedData = products.map((row1, index) => {
      const row2 = newInputValues[index];
      return { ...row1, ...row2 };
    });

    await updateDoc(devisQuincailler, {
      nbreJoursGarantie: parseInt(garantie),
      nbreJoursLivraison: parseInt(delai),
      items: mergedData,
      date_update: new Date(),
      prixLivraison: parseInt(prixlivrai),
      netapayer: netApayer(),
      Tva: calculateTotalTva(),
      totalHt: calculateTotalHt(),
      totalTtc: calculateTotalHt() + calculateTotalTva(),
      netapayer: netApayer(),
    }).then(() => {
      toast.success("Modifié avec success");
      navigate("/crm");
    });
  };

  const calculateTotalHt = () => {
    return products.reduce((total, row, index) => {
      const price = newInputValues[index]?.pu || parseInt(row.pu);
      return parseInt(total + price * parseInt(row.qte));
    }, 0);
  };

  const calculateTotalTva = () => {
    if (checked) {
      return products.reduce((total, row, index) => {
        const price = newInputValues[index]?.pu || row.pu;
        return parseInt(total + price * parseInt(row.qte) * 0.1925);
      }, 0);
    } else return 0;
  };

  const netApayer = () => {
    if (prixlivrai == "") return calculateTotalTva() + calculateTotalHt();
    else return calculateTotalTva() + calculateTotalHt() + parseInt(prixlivrai);
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <>
      <div translate="no">
        <div className="lg:flex justify-between flex-wrap items-center mb-6">
          <h4 className="text-[#067BBF]">Facture</h4>

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
                    colSpan={2}
                    className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left"
                  >
                    <span className="block px-6 py-5 font-semibold">PRODUIT</span>
                  </th>
                  <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
                    <span className="block px-6 py-5 font-semibold">QTE</span>
                  </th>
                  <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
                    <span className="block px-6 py-5 font-semibold">UNIT</span>
                  </th>
                  <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
                    <span className="block px-6 py-5 font-semibold">PRIX</span>
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
                      colSpan={2}
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
                      <input
                        style={{ width: 100 + "px" }}
                        type="number"
                        min={0}
                        defaultValue={0}
                        onChange={(e) => {
                          const qte = parseInt(row.qte, 10);
                          const updatedInputValues = { ...newInputValues };
                          const value = e.target.value;

                          // Vérifiez si la valeur est vide
                          if (value === "") {
                            // Si le champ est vide, affichez la valeur par défaut
                            updatedInputValues[index] = {
                              ...(updatedInputValues[index] || {}),
                              pu: 0,
                              pt: row.pu * qte,
                            };
                          } else {
                            const numericValue = parseInt(value);
                            updatedInputValues[index] = {
                              ...(updatedInputValues[index] || {}),
                              pu: numericValue,
                              pt: numericValue * qte,
                            };
                          }
                          setNewInputValues(updatedInputValues);
                        }}
                      />
                    </td>
                    <td className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                      <span> {newInputValues[index] ? newInputValues[index].pt : row.pt}</span>

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
                  {calculateTotalHt()}XAF
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                  />
                  Tva (19,25%):
                </span>
                <span className="text-slate-900 dark:text-slate-300">
                  {calculateTotalTva()} XAF
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
                  Total Ttc:
                </span>
                <span className="text-slate-900 dark:text-slate-300 font-bold">
                  {calculateTotalHt() + calculateTotalTva()} XAF
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
                  Prix Livraison:
                </span>
                <span className="text-slate-900 dark:text-slate-300 font-bold">
                  <input
                    style={{ width: 60 + "px" }}
                    type="number"
                    min={0}
                    defaultValue={0}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Vérifiez si la valeur est vide
                      if (value === "") {
                        // Si le champ est vide, affichez la valeur par défaut
                        setprixlivrai(0);
                      } else {
                        setprixlivrai(value);
                      }
                    }}
                  />{" "}
                  XAF
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
                  Delai Livraison:
                </span>
                <span className="text-slate-900 dark:text-slate-300 font-bold">
                  <input
                    style={{ width: 60 + "px" }}
                    type="number"
                    min={0}
                    max={24}
                    defaultValue={0}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Vérifiez si la valeur est vide
                      if (e.target.value > 24) { toast.error("Le nombre d'heure ne doit pas depasser 24") }
                      else if (value === "") {
                        // Si le champ est vide, affichez la valeur par défaut
                        setdelai(0);
                      } else {
                        setdelai(value);
                      }
                    }}
                  />{" "}
                  Heures
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
                  Jours garantie:
                </span>
                <span className="text-slate-900 dark:text-slate-300 font-bold">
                  <input
                    style={{ width: 60 + "px" }}
                    type="number"
                    min={0}
                    defaultValue={0}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Vérifiez si la valeur est vide
                      if (value === "") {
                        // Si le champ est vide, affichez la valeur par défaut
                        setgarantie(0);
                      } else {
                        setgarantie(value);
                      }
                    }}
                  />{" "}
                  Jours
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
                  Net a payer:
                </span>
                <span className="text-slate-900 dark:text-slate-300 font-bold">
                  {netApayer()} XAF
                </span>
              </div>
            </div>
          </div>
        </Card>
        <br/>
        <button style={{}} class="btn btn-primary btn-sm" onClick={handleSubmit}>
          Modifier
        </button>
      </div>

    </>
  );
};

export default Visualisation;
