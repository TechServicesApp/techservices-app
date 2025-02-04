import React from "react";
import ProformaTables from "../table/react-tables/ProformaTables";
import HomeBredCurbs from "./HomeBredCurbs";


const  Proforma = () => {
  return (
    <div>
    
      <div className="space-y-5">
        <ProformaTables title="Attente de validation" />
      </div>
    </div>
  );
};

export default Proforma;
