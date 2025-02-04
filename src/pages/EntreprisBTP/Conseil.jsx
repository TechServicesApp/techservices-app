import React from 'react';

const Conseil = () => {
    return (
        <div>
            Conseil
            <div className="flex space-x-4">
            <Button
              icon="heroicons-outline:search"
              className="btn-primary dark:bg-slate-600 text-[12px] "
              onClick={() => {
                navigate("/formulaireannonce");
              }}
            >
              {" "}
              Publier une annonce
            </Button>
          </div>

          <div className="px-6 pt-4 flex space-x-2">
            <Button
              className={` text-[12px] btn btn-sm ${
                filterType1 === 1 ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => handleFilter(filterType, 1)}
            >
              En attente
            </Button>
            <Button
              className={`btn text-[12px] btn-sm ${
                filterType1 === 0 ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => handleFilter(filterType, 0)}
            >
              Refusee
            </Button>
            <Button
              className={`btn text-[12px] btn-sm ${
                filterType1 === 2 ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => handleFilter(filterType, 2)}
            >
              acceptée
            </Button>
            <Button
              className="btn text-[12px] btn-sm btn-outline-primary"
              onClick={() => handleFilter(filterType, null)}
            >
              Tout
            </Button>
          </div>
          <div className="px-6 pt-4 flex space-x-2">
            <Button
              className={`btn btn-sm text-[12px] ${
                filterType === "Formation" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => handleFilter("Formation", filterType1)}
            >
              Formation
            </Button>
            <Button
              className={`btn btn-sm text-[12px] ${
                filterType === "Conseil" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => handleFilter("Conseil", filterType1)}
            >
              Conseil
            </Button>
            <Button
              className={`btn btn-sm text-[12px] ${
                filterType === "Recrutement" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => handleFilter("Recrutement", filterType1)}
            >
              Recrutement
            </Button>
            <Button
              className="btn btn-sm text-[12px] btn-outline-primary"
              onClick={() => handleFilter(null, filterType1)} // Réinitialiser le filtre
            >
              Tout
            </Button>
          </div>
        </div>
    );
};

export default Conseil;