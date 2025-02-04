import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import { auth, db } from "@/firebaseconfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "./GlobalFilter";
import { Link } from "react-router-dom";

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return <input type="checkbox" ref={resolvedRef} {...rest} className="table-checkbox" />;
});

const VusialisationDevis = ({ title = "Quincaillerie" }) => {
  const [Devis, setDevis] = useState([]);
  const [selectedDevis, setSelectedDevis] = useState(null);

  const COLUMNS = useMemo(() => [
    { Header: "N°", Cell: (row) => <span>{row.row.index + 1}</span> },
    { Header: "Nom Client", accessor: "nom" },
    { Header: "Téléphone Client", accessor: "telephone" },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <button className="btn btn-info" onClick={() => fetchDevisDetails(row.original.id)}>
          Voir devis
        </button>
      ),
    },
  ], []);

  useEffect(() => {
    const fetchDevis = async () => {
      const devisCollection = collection(db, "Quincaillerie");
      const devisSnapshot = await getDocs(devisCollection);
      const devisList = devisSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDevis(devisList);
    };

    fetchDevis();
  }, []);

  const fetchDevisDetails = async (id) => {
    const devisDoc = doc(db, "Devis", id);
    const devisData = await getDoc(devisDoc);
    if (devisData.exists()) {
      setSelectedDevis({ id: id, ...devisData.data() });
    } else {
      console.log("No such document!");
    }
  };

  const tableInstance = useTable(
    { columns: COLUMNS, data: Devis },
    useGlobalFilter, useSortBy, usePagination, useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        { id: "selection", Header: ({ getToggleAllRowsSelectedProps }) => <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />, Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} /> },
        ...columns,
      ]);
    }
  );

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow, state, setGlobalFilter } = tableInstance;

  if (selectedDevis) {
    return (
      <div className="p-4">
        <button className="btn btn-secondary mb-4" onClick={() => setSelectedDevis(null)}>Retour</button>
        <h2 className="text-lg font-semibold mb-4">{selectedDevis.nom}</h2>
        <h2 className="text-lg font-semibold mb-4">{selectedDevis.email}</h2>
        <h2 className="text-lg font-semibold mb-4">{selectedDevis.telephone}</h2>
        <iframe
          src={selectedDevis.doc1}
          width="100%"
          height="950px"
          style={{ border: "none", marginTop: "50px" }}
          title="PDF Viewer"
        ></iframe>
      </div>
    );
  }

  return (
    <Card>
      <div className="md:flex justify-between items-center mb-6">
        <h4 className="card-title">{title}</h4>
        <GlobalFilter filter={state.globalFilter} setFilter={setGlobalFilter} />
      </div>
      <div className="overflow-x-auto -mx-6">
        <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700" {...getTableProps()}>
          <thead className="bg-slate-200 dark:bg-slate-700">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} scope="col" className="table-th">
                    {column.render("Header")}
                    <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700" {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="table-td">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default VusialisationDevis;
 