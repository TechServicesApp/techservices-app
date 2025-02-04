import React, { useState, useEffect } from "react";
import Visualisation from "../table/react-tables/Visualisation";
import jsPDF from "jspdf";
import { useRef } from "react";

function VisualisationFacture() {
  return (
    <div>
      <div>
        <Visualisation />
      </div>
    </div>
  );
}

export default VisualisationFacture;
