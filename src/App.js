import { useState } from "react";
import AreaNameInput from "./AreaNameInput";
import Information from "./Information";
import Map from "./Map";

function App() {
  const [areaName, setAreaName] = useState("");
  const [polygonExtractMode, setPolygonExtractMode] = useState(false);
  console.log(areaName);

  function handleAreaNameChange(e) {
    e.preventDefault();
    setAreaName(e.target.value);
  }

  function handleGeoJsonPolygonAdd(geoJsonPolygon) {
    console.log("app", geoJsonPolygon);
    setAreaName("");
  }

  function handleGetPolygonBtnClick() {
    setPolygonExtractMode(!polygonExtractMode);
  }

  return (
    <div className="App">
      <Map
        polygonExtractMode={polygonExtractMode}
        onGeoJsonPolygonAdd={handleGeoJsonPolygonAdd}
      />
      <AreaNameInput
        areaName={areaName}
        onAreaNameChange={handleAreaNameChange}
        polygonExtractMode={polygonExtractMode}
        onGetPolygonBtnClick={handleGetPolygonBtnClick}
      />
    </div>
  );
}

export default App;
