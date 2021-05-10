import { useState } from "react";
import AreaNameInput from "./AreaNameInput";
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

      <div>
        <p>
          <em>지도를 마우스로 클릭하면 다각형 그리기가 시작되고 <br/>오른쪽 마우스를 클릭하면 다각형 그리기가 종료됩니다</em>
        </p>
      </div>
    </div>
  );
}

export default App;
