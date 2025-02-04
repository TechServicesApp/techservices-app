import React, { useState} from "react";
import { format } from "date-fns";
import { sendNotificationToSomeone } from "@/sendNotificationToSomeone";
import {
  collection,
  getDoc,
  getDocs,
  setDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth, db } from "@/firebaseconfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { useParams } from "react-router-dom";
import { infoclient } from "@/pages/dashboard/InfoClient";
import { notifiquincaillerie, formatNumberWithSpaces } from "@/fonctionnotification";


const Modification = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [data, setData] = useState([]);
  const [newInputValues, setNewInputValues] = useState({});
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
  const [devisId, setdevisId] = useState("");
  const [checked, setChecked] = useState(false);
  const [prixlivrai, setprixlivrai] = useState(0);
  const [addresselivraison, setaddresselivraison] = useState("");
  const [garantie, setgarantie] = useState(0);
  const [picker2, setPicker2] = useState(0);

  const devisEnvoye = doc(collection(db, "DevisQuincailler"));

  const handleChange = () => {
    setChecked(!checked);
  };

  const fetchPost = async () => {
    try {
      const doc2 = await getDoc(doc(db, "Devis", id));

      if (doc2.exists) {
        setdevisId(doc2.id);

        const data = doc2.data();
   
        const info = await infoclient({
          nomcollection: data?.sendercollection,
          idclient: data?.senderId,
        });
      
        setData(data);
        setnomTechni(info?.nom);
        setemailTechni(info?.email);
        settelTechni(info?.telephone);
        setadressetelTechni(info?.adresse);

        if (data?.type) {
          setaddresselivraison(data?.adresse);
        }
        else {
          const idbesoin = data?.besioinId;
          const docbesoin = await getDoc(doc(db, "Besoins", idbesoin));
          if (docbesoin.exists) {
            setaddresselivraison(docbesoin.data()?.adresse);
          }
        }
        const modifiedData =
          data && data?.items?.length > 0
            ? data?.items?.map((item, index) => {
              return { ...item, pt: 0, pu: 0 };
            })
            : [];
        setProducts(modifiedData);

        const uid =auth.currentUser.uid;

        if (uid.length > 0) {
          const q1 = query(
            collection(db, "Quincaillerie"),
            where("uid", "==", uid)
          );

          const querySnapshot1 = await getDocs(q1);

          querySnapshot1.forEach((doc) => {
            if (doc.exists) {
              setnomquin(doc.data()?.nom);
              setemailquin(doc.data()?.email);
              settelquin(doc.data()?.telephone);
              setadressequin(doc.data()?.localisation);
              setlogo(doc.data()?.logo);
             
              const idspecialiteValues = Array.isArray(doc.data().idspecialite)
              ? doc.data().idspecialite.map(obj => obj.label)
              : [doc.data().idspecialite.label];
              setspecialitequincailler(idspecialiteValues.join(", "))
            }
          });
        } else {
          console.log("le quincailler n'est pas authentifie");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;

    const updatedData = [...products];
    for (const rowId in newInputValues) {
      const updatedRow = {
        ...products.find((row, index) => index === rowId),
        ...newInputValues[rowId],
      };
      updatedData?.push(updatedRow);
    }

    const mergedData = products.map((row1, index) => {
      const row2 = newInputValues[index];
      return { ...row1, ...row2 };
    });

    try {
      const nbre =
        "TS" +
        format(new Date(), "dd") +
        format(new Date(), "MM") +
        format(new Date(), "yyyy") +
        (Math.floor(Math.random() * (99999 - 0 + 1)) + 0);


      await setDoc(devisEnvoye, {
        senderId: data?.senderId,
        sendercollection: data?.sendercollection,
        nbreJoursLivraison: parseInt(picker2),
        nbreJoursGarantie: parseInt(garantie),
        items: mergedData,
        totalHt: calculateTotalHt(),
        totalTtc: calculateTotalHt() + calculateTotalTva(),
        prixLivraison: parseInt(prixlivrai),
        Tva: calculateTotalTva(),
        etat: 0,
        technicienId: data?.senderId,
        besoinId: data.type ? (id) : (data?.besioinId),
        matriculeDevis: nbre,
        Id: devisEnvoye.id,
        devisId: devisId,
        quincailleruid: auth.currentUser.uid,
        created_at: new Date(),
        date: format(new Date(), "dd/MM/yyyy"),
        netapayer: netApayer(),
        hasNewInfo: true,
        nouveaute: "Paiement Proforma",
        nomspecialite: specialitequincailler
      }).then(async () => {
        toast.success("Envoyé avec success");
        try {
          await notifiquincaillerie({
            desti: data?.sendercollection,
            icone: "bag-handle-outline",
            serviceid: ( data?.besioinId)?(data?.besioinId):(null),
            technicienuid: data?.senderId,
            uidquincailler: auth.currentUser.uid,
            typeNotification: "Nouvelleproforma",
            titleNotification: "Nouvelle proforma",
            descriptionNotification: `Vous avez reçu un proforma  avec un net à payer de ${formatNumberWithSpaces(netApayer())} F CFA`
          })
            .then(() => {
              console.log("envoye notifi");
              navigate("/crm");
            })
          await sendNotificationToSomeone({
            receiveID: data?.senderId,
            userType: data?.sendercollection,
            message: `Proforma N° ${nbre} envoyée avec un net à payer de ${netApayer()}`,
            title: "Nouvelle proforma",
          }).then(() => {
            console.log("envoye");
          });



        } catch {
          navigate("/crm");
        }
      });
    } catch (error) {
      console.log(error);
    }
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
    if (prixlivrai == 0) return calculateTotalTva() + calculateTotalHt();
    else return calculateTotalTva() + calculateTotalHt() + parseInt(prixlivrai);
  };

  useEffect(() => {

    if (!id) {
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {

        fetchPost();

      } else {
        // L'utilisateur n'est pas authentifié, redirection ou action
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [id]);

  return (
    <>
      <div translate="no">
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
                {addresselivraison} <br />
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
          </div>
          <div className="max-w-[980px] mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
            <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
              <thead className="bg-slate-200 dark:bg-slate-700">
                <tr>
                  <th
                    colSpan={2}
                    className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left"
                  >
                    {" "}
                    <span className="block px-6 py-5 font-semibold">
                      PRODUIT
                    </span>
                  </th>
                  <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
                    {" "}
                    <span className="block px-6 py-5 font-semibold">QTE</span>
                  </th>
                  <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
                    {" "}
                    <span className="block px-6 py-5 font-semibold">UNIT</span>
                  </th>
                  <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
                    {" "}
                    <span className="block px-6 py-5 font-semibold">PRIX</span>
                  </th>
                  <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs  font-medium leading-4 uppercase text-slate-600 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left">
                    <span className="block px-6 py-5 font-semibold">TOTAL</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                {products &&
                  products.length > 0 &&
                  products.map((row, index) => (
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
                          style={{ width: 120 + "px" }}
                          type="number"
                          defaultValue={0}
                          // value={
                          //   newInputValues[index]
                          //     ? newInputValues[index].pu
                          //     : "0"
                          // }
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
                        <span>
                          {" "}
                          {newInputValues[index]
                            ? newInputValues[index].pt
                            : "0"}{" "}
                        </span>
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
                    // value={prixlivrai || 0}
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
                  Net a payer:
                </span>
                <span className="text-slate-900 dark:text-slate-300 font-bold">
                  {netApayer()} XAF
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
                  Delai de livraison:
                </span>
                <span className="text-slate-900 dark:text-slate-300 font-bold">
                  <input
                    style={{ width: 60 + "px" }}
                    type="number"
                    min="0"
                    max="24"
                    defaultValue={0}
                    // value={picker2}
                    onChange={(e) => {
                      if (e.target.value > 24) {
                        toast.error(
                          "Le nombre d'heure ne doit pas depasser 24"
                        );
                      } else if (e.target.value === "") {
                        // Si le champ est vide, affichez la valeur par défaut
                        setPicker2(0);
                      } else {
                        setPicker2(e.target.value);
                      }
                    }}
                  />
                  HRS
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
                  jours de garantie
                </span>
                <span className="text-slate-900 dark:text-slate-300 font-bold">
                  <input
                    style={{ width: 60 + "px" }}
                    type="number"
                    min={0}
                    defaultValue={0}
                    // value={garantie}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        // Si le champ est vide, affichez la valeur par défaut
                        setgarantie(0);
                      } else {
                        setgarantie(e.target.value);
                      }
                    }}
                  />{" "}
                  JOURS
                </span>
              </div>

              <button style={{}} class="btn btn-primary btn-sm" onClick={handleSubmit}>
                Envoyer
              </button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Modification;
