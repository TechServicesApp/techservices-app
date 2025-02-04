import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { toast } from "react-toastify";
import InputGroup from "@/components/ui/InputGroup";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { auth, db, imgdb } from "@/firebaseconfig";
import { sendNotificationToSomeone } from "@/sendNotificationToSomeone";
import { Notificationclick } from "@/fonctionnotification";
import { notifiquincaillerie, formatNumberWithSpaces } from "@/fonctionnotification";
import {
  collection,
  where,
  query,
  getDocs,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { useNavigate } from "react-router-dom";
import { infoclient } from "./InfoClient";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          ref={resolvedRef}
          {...rest}
          className="table-checkbox"
        />
      </>
    );
  }
);

const Receptionné = ({ title = "Attente de paiement" }) => {
  const [Devis, setDevis] = useState([]);
  const [filter, setFilter] = useState("Tous");
  const [numero, setnumero] = useState(0);
  const [nom, setnom] = useState("");
  const [Devis1, setDevis1] = useState([]);
  const navigate = useNavigate();

  const paiementquincailler = collection(db, "paiementQuincailer");

  const handleChange1 = (e) => {
    setnom(e.target.value);
  };

  const handleChange = (e) => {
    setnumero(e.target.value);
  };

  const COLUMNS = [
    {
      Header: "N°",
      Cell: (row) => {
        return <span>{row.row.index + 1}</span>;
      },
    },
    {
      Header: "Client",
      accessor: "devisInfo.nom",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Date envoie",
      accessor: "date",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Téléphone",
      accessor: "devisInfo.telephone",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Etat",
      accessor: "etat",
      Cell: (row) => {
        return row.value === 2 ? (
          <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25  bg-green-500">
            Paiement en cours
          </span>
        ) : (
          <span className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
            Informations requises
          </span>
        );
      },
    },

    {
      Header: "Action",
      accessor: (row) => ({
        etat: row.etat,
        id: row.Id,
        idtechni: row.senderId,
        techni: row.senderId,
        montant: row.netapayer,
        quincailler: row.quincailleruid,
        besoin: row.besoinId?(row.besoinId):(null),
        moyenPaiement: row.moyenPaiement,
        collection: row.sendercollection

      }),
      Cell: (row) => {
        return (
          <div className="flex space-x-3 rtl:space-x-reverse">
            <Tooltip
              content="Voir facture"
              placement="top"
              arrow
              animation="shift-away"
            >
              <button
                translate="no"
                className="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer text-white bg-[#067BBF] dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-100 rtl:space-x-reverse"
                onClick={() => {
                  Notificationclick({ etat: row.value.etat })
                  navigate(`/facture/${row.value.id}`);
                }}
              >
                Facture
              </button>
            </Tooltip>

            {row.value.etat === 1 && (
              <div className="flex space-x-4">
                <Tooltip
                  content="Formulaire Paiement"
                  placement="top"
                  arrow
                  animation="shift-away"
                >
                  <Modal
                    title="paiement"
                    label="Paiement"
                    labelClass="invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-[#067BBF] dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-100 rtl:space-x-reverse"
                    uncontrol
                  >
                    <div className="text-base text-slate-600 dark:text-slate-300">
                      <form
                        onSubmit={handleSubmit((data) =>
                          envoyer(
                            data,
                            row.value.techni,
                            row.value.besoin,
                            row.value.id,
                            row.value.montant,
                            row.value.quincailler,
                            row.value.moyenPaiement,
                            row.value.collection,
                            row.value.idtechni
                          )
                        )}
                        className="space-y-4 "
                      >
                        <Textinput
                          name="paiement"
                          label="Moyen de Paiement"
                          type="text"
                          placeholder={row.value.moyenPaiement || ""}
                          readonly
                          className="h-[48px]"
                          register={register}
                        />
                        <Textinput
                          name="nom"
                          label="Nom du bénéficiaire"
                          type="text"
                          register={register}
                          error={errors.nom}
                          value={nom}
                          placeholder="Nom bénéficiaire"
                          onChange={handleChange1}
                          className="h-[48px]"
                        />

                        <InputGroup
                          className="row"
                          label="Telephone"
                          type="text"
                          prepend="+237"
                          placeholder="numero de telephone"
                          name="numero"
                          error={errors.numero}
                          register={register}
                          value={numero}
                          onChange={handleChange}
                        />
                        <div className="ltr:text-right rtl:text-left">
                          <button className="btn btn-dark  text-center">
                            Envoyer
                          </button>
                        </div>
                      </form>
                    </div>
                  </Modal>
                </Tooltip>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const schema = yup
    .object({
      nom: yup.string().required("veuillez remplir"),
      numero: yup
        .string()
        .required("Veuillez remplir")
        .matches(/^[0-9]{9}$/, "Telephone invalide"),
    })
    .required();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });

  const envoyer = async (
    data,
    techni,
    besoin,
    devisid,
    montantPrevu,
    quincailler,
    paiement,
    collection,
    idtechni
  ) => {
    try {
      const quincaillerieDevis = doc(db, "DevisQuincailler", devisid);
      await updateDoc(quincaillerieDevis, {
        etat: 2,
      });

      await addDoc(paiementquincailler, {//cree un document dans la collection paiementquincailler contenant tous les informations sur le paiement a effectuer par le technicien
        nomBeneficiaire: data.nom,
        telephoneBeneficiaire: parseInt(data.numero),
        moyenPaiement: paiement,
        quincailleruid: quincailler,
        technicienId: techni,
        besoinId: besoin,
        devisQuincaillerId: devisid,
        date_created: new Date(),
        montantPrevu: montantPrevu,
        etatPaiement: 0,
        date: format(new Date(), "dd/MM/yyyy"),
        hasNewInfo: true,
        nouveaute: "Paiement Proforma"
      }).then(async () => {
        toast.success("envoyé avec success");
        try {
          await notifiquincaillerie({
            desti: collection,
             serviceid: besoin,
            technicienuid: techni,
            uidquincailler: auth.currentUser.uid,
            typeNotification: "NouvelleInformation",
            titleNotification: "Proforma : Paiement",
            descriptionNotification: `Vous avez reçu des informations de paiement et vous devez payer un  montant de ${formatNumberWithSpaces(montantPrevu)} F CFA `,
            icone: "wallet-outline"
          })
            .then(() => {
              console.log("envoye notifi");
              navigate("/crm");
            })
          await sendNotificationToSomeone({
            receiveID: idtechni,
            userType: collection,
            message: `Informations de paiement envoyée et un montant de ${montantPrevu} est attendu`,
            title: "Nouvelle Information",
          }).then(() => {

          });



        } catch {

        }

      });

      data.nom = "";
      data.numero = "";
    } catch (error) {
      console.log(error.code);
    }
  };

  const fetchData = async () => {
    try {
      const coll = collection(db, "DevisQuincailler");// recupere tous les proforma qui sont en attente de paiement ou paye
      const q = query(
        coll,
        where("quincailleruid", "==", auth.currentUser.uid),
        where("etat", "in", [1, 2])
      );
      const querySnapshot = await getDocs(q);

      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDevis(newData);

      const promises = newData.map(async (item) => {
        const devisInfo = await infoclient({ nomcollection: item.sendercollection, idclient: item.senderId });
        return {
          ...item,
          devisInfo: devisInfo,
        };
      });

      const newDataWithDevis = await Promise.all(promises);
      setDevis1(newDataWithDevis);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    }
  };



  useEffect(() => {
    const fetchDataInterval = setInterval(fetchData, 5000); // recharge le tableau apres 5 seconde

    return () => clearInterval(fetchDataInterval); // Cleanup on unmount
  }, []);

  const filteredData = useMemo(() => {
    if (filter === "Tous") {
      return Devis1;
    }
    return Devis.filter((item) => item.status === filter);
  }, [Devis1, filter]);

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => filteredData, [filteredData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <>
      <Card>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title text-[#067BBF]">{title}</h4>
          <div>
            {/* <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} /> */}
          </div>
        </div>

        <div translate="no" className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps()}
              >
                <thead className="bg-slate-200 dark:bg-slate-700">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className="table-th"
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getTableBodyProps()}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()} className="table-td">
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <select
              className="form-control py-2 w-max"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Afficher {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Page{" "}
              <span>
                {pageIndex + 1} sur {pageOptions.length}
              </span>
            </span>
          </div>
          <ul className="flex items-center space-x-3 rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                Précédent
              </button>
            </li>
            {pageOptions.map((page, pageIdx) => (
              <li key={pageIdx}>
                <button
                  href="#"
                  aria-current="page"
                  className={`${pageIdx === pageIndex
                      ? "bg-slate-900 dark:bg-slate-600 dark:text-slate-200 text-white font-medium"
                      : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900 font-normal"
                    } text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => gotoPage(pageIdx)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${!canNextPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                Suivant
              </button>
            </li>
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className={`${!canNextPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
        </div>
      </Card>
    </>
  );
};

export default Receptionné;
