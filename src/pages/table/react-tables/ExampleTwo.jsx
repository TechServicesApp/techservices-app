import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { auth, db } from "@/firebaseconfig";
import { bonCommande } from "@/pages/dashboard/fonctions/FonctionProforma";
import { infoclient } from "@/pages/dashboard/InfoClient";
import {
  collection,
  where,
  getCountFromServer,
  query,
} from "firebase/firestore";
import { Notificationcmdclick } from "@/fonctionnotification";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "./GlobalFilter";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

const ExampleTwo = ({ title = "Advanced Table Two" }) => {
  const [Devis, setDevis] = useState([]);

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
    {    Header: "Date envoie",
      accessor: "creationDate.seconds",
      Cell: (row) => {
        return <span>{new Date(row?.cell?.value * 1000
        ).toLocaleDateString()}</span>;
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
      Header: "Action",
      accessor: (row) => ({
        besoin: row?.besioinId,
        id: row?.id,
        type:row?.type
      }),
      Cell: (row) => {
        return (
          <div className="flex space-x-3 rtl:space-x-reverse">
            <Tooltip
              content="Faire proforma"
              placement="top"
              arrow
              animation="shift-away"
            >
              <button
                className=" invocie-btn inline-flex btn btn-sm whitespace-nowrap space-x-1 cursor-pointer bg-[#067BBF] text-white dark:bg-slate-800 dark:text-slate-300 btn-md h-min text-sm font-normal text-slate-100 rtl:space-x-reverse"
                 translate="no"
                onClick={async () => {
                  Notificationcmdclick()
                if(row?.value?.type){
                  navigate(`/modification/${row?.value?.id}`)
                  
                }
                else{
                  const besoin1 = row?.value?.besoin;
              
                  const coll = collection(db, "DevisQuincailler");
                  const q = query(
                    coll,
                    where("quincailleruid", "==", auth.currentUser.uid),
                    where("besoinId", "==", besoin1)
                  );
                  const snapshot = getCountFromServer(q);
                  if ((await snapshot).data().count > 0) {
                    toast.info("Proforma deja envoyé");
                  } else {
                  
                    navigate(`/modification/${row?.value?.id}`);
                  }
                }
                }}
              >
                Faire proforma
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  const [filter, setFilter] = useState("Tous");
  const navigate = useNavigate();

  const fetchPost = async () => {

   const  filteredDevis = await bonCommande()
    setDevis(filteredDevis);
    const promises = filteredDevis.map(async (item) => {
      const devisInfo = await infoclient({nomcollection:item.sendercollection,idclient:item.senderId});
      return {
        ...item,
        devisInfo: devisInfo,
      };
    });

    const newDataWithDevis = await Promise.all(promises);
    
    const sortedData = newDataWithDevis.sort((a, b) => b.creationDate.seconds - a.creationDate.seconds);

    setDevis(sortedData);
  };

  useEffect(() => {
    const fetchDataInterval = setInterval(fetchPost, 15000); // 5 seconds


    return () => clearInterval(fetchDataInterval); // Cleanup on unmount
  }, []);
    
  

  const filteredData = useMemo(() => {
    if (filter === "Tous") {
      return Devis;
    }
    return Devis.filter((item) => item.status === filter);
  }, [Devis, filter]);

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
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>
        <div className="mb-4"></div>
        <div className="overflow-x-auto -mx-6" translate="no">
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
                className={`${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
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
                  className={`${
                    pageIdx === pageIndex
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
                className={`${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
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
                className={`${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
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

export default ExampleTwo;
