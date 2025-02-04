import React, { useState } from "react";
import { auth, db } from "@/firebaseconfig";
import userDarkMode from "@/hooks/useDarkMode";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Swal from "sweetalert2";
import {
  collection,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  deleteDoc
} from "firebase/firestore";
import { infoclient } from "@/pages/dashboard/InfoClient";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Notificationid } from "@/fonctionnotification";
import { sendNotificationToSomeone } from "@/sendNotificationToSomeone";
import { notifiquincaillerie } from "@/fonctionnotification";

const Visualisation = () => {
  const showAlert = async (image, id, type,iddevis) => {
    if (imagevue) {
      await Swal.fire({
        title: "Preuve de paiement",
        imageUrl: image,
        imageWidth: 350,
        imageHeight: 550,
        confirmButtonText: "OK",
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: "swal-padding-bottom",
        },
      });
    } else {
      const result = await Swal.fire({
        title: "Preuve de paiement",
        imageUrl: image,
        imageWidth: 350,
        imageHeight: 550,
        confirmButtonText: "Confirmer",
        cancelButtonText: "Annuler",
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
        text: "Voulez-vous marquer ce paiement comme effectué ?",
        customClass: {
          popup: "swal-padding-bottom",
        },
      });


      // Vérifiez le résultat de la SweetAlert2
      if (result.isConfirmed) {
        // Si l'utilisateur clique sur "Confirmer", mettre à jour le document
        await updateDoc(doc(db, "DevisQuincailler", iddevis), {
          imagevue: true,
        });
        setData({ ...data, imagevue: true })
        setimagevue(true)

        // Optionnel: Vous pouvez également afficher un message de succès ou faire d'autres actions ici
        Swal.fire(
          "Vous venez de confirmer que le paiement a été effectué"
        );
      } else {

        await updateDoc(doc(db, "DevisQuincailler", iddevis), {
          etat:1,
          imagevue: false,
        });
        await updateDoc(doc(db, "paiementQuincailer", idpaiement), {
         
          deleted_at: new Date(),
        });
        

        setData({ ...data, imagevue: false })

        Swal.fire(
          "Vous venez de refuser la preuve"
        );

        await notifiquincaillerie({
          desti:type,
          icone: "bag-handle-outline",
          serviceid: iddevis,
          technicienuid: id,
          uidquincailler: auth.currentUser.uid,
          typeNotification: "InformationPaiement",
          titleNotification: "Proforma: Paiement",
          descriptionNotification: `Votre preuve de paiement a ete refusee`
        })

        await sendNotificationToSomeone({
          receiveID: id,
          userType: type,
          message: `Votre preuve de paiement a ete refusee`,
          title: "Proforma: Paiement",
        })
      }
    }
  };

  const annuler = async ({ id, coll }) => {

    await deleteDoc(doc(db, coll, id)).then(async () => {
      await Notificationid({ id: id }).then(() => { toast.success("supprimé avec success"), navigate("/crm") })
    });

  }

  
  const printPage = () => {
    const printContent = document.getElementById("printableArea").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };
  const [isDark] = userDarkMode();
  const { id } = useParams();
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
  const [image, setimage] = useState("");
  const [imagevue, setimagevue] = useState(false)
  const [specialitequincailler, setspecialitequincailler] = useState("")
  const [idpaiement,setIdpaiement] = useState("")
  const navigate = useNavigate()

  const generer = async () => {
    const randomCode = generateRandomCode();
    await updateDoc(doc(db, "DevisQuincailler", id), {
      codesecret: randomCode,
    });
    setData({ ...data, codesecret: randomCode });
  };
  const generateRandomCode = () => {
    const characters =
      "0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };
  const fetchPost = async () => {
    const doc2 = await getDoc(doc(db, "DevisQuincailler", id));

    if (doc2.data().etat >= 3) {
      if (doc2.data().imagevue === true) {
        setimagevue(true)
      }
      const imagedoc = query(
        collection(db, "paiementQuincailer"),
        where("devisQuincaillerId", "==", doc2.data().Id),
        where("deleted_at", "==", null) 
      );

      const querySnapshot2 = await getDocs(imagedoc);

      querySnapshot2.forEach((doc) => {
        setimage(doc.data()?.proofImage);
        setIdpaiement(doc.id)

      });
    }

    const data1 = doc2.data();

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

    setData(data1);

    const q = query(
      collection(db, "Techniciens"),
      where("uid", "==", data1.technicienId)
    );

    const querySnapshot = await getDocs(q);
    const info = await infoclient({
      nomcollection: data1?.sendercollection,
      idclient: data1?.senderId,
    });


    setnomTechni(info?.nom);
    setemailTechni(info?.email);
    settelTechni(info?.telephone);
    setadressetelTechni(info?.adresse);

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
      <style>{`
        .swal-padding-bottom {
          padding-bottom: 100px; /* Ajustez cette valeur selon vos besoins */
        }
      `}</style>
      <div id="printableArea">

        <div className="lg:flex justify-between flex-wrap items-center mb-6">
          <h4 className="text-[#067BBF]">Facture</h4>
          <div className="flex lg:justify-end items-center flex-wrap space-xy-5">
            <button
              type="button"
              onClick={printPage}
              className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-900 rtl:space-x-reverse"
            >
              <span className="text-lg">
                <Icon icon="heroicons:printer" />
              </span>
              <span>Imprimer</span>
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
                <div className="mt-[6px] flex space-x-2 leading-[1] rtl:space-x-reverse">
                  <Icon icon="heroicons-outline:mail" />
                  <span>{specialitequincailler}</span>
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
                {products &&
                  products.length > 0 && products.map((row, index) => (
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
                  {data.prixLivraison + data.totalTtc || 0} XAF
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

              {data.etat === 1 && (
                <button
                  className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 text-white cursor-pointer bg-[#067BBF] dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-bold text-slate-900 rtl:space-x-reverse"
                  onClick={async () => {
                    await annuler({ id: id, coll: "DevisQuincailler" });
                  }}
                >
                  Annuler
                </button>
              )}
              {data.etat >= 3 &&  (!data.imagevue || data.imagevue === true) && <button
                className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 text-white cursor-pointer bg-[#067BBF] dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-bold text-slate-900 rtl:space-x-reverse"
                onClick={async () => { await showAlert(image, data.senderId, data.sendercollection,id) }}
              >
                Preuve de paiement
              </button>

              }
              <br />
              {data.etat === 3 && !data.codesecret && data.imagevue===true && (
                <button
                  className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer text-white bg-[#067BBF] dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-bold text-slate-900 rtl:space-x-reverse"
                  onClick={async () => {
                    await generer();
                  }}
                >
                  Generer code secret{" "}
                </button>
              )}
              {data.etat === 3 && data.codesecret && (
                <div className="flex justify-between">
                  <span className="font-medium text-slate-600 text-xs dark:text-slate-300 uppercase">
                    Code secret:
                  </span>
                  <span className="text-slate-900 dark:text-slate-300 font-bold">
                    {data.codesecret}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Visualisation;
