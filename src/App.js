import { useCallback, useEffect, useRef, useState } from "react";
import AreaNameInput from "./AreaNameInput";
import Map from "./Map";
import ResultTextArea from "./ResultTextArea";

const INITIAL_LAT = 37.558309;
const INITIAL_LNG = 126.925776;
const INITIAL_LEVEL = 7;

function App() {
  const [center, setCenter] = useState([INITIAL_LAT, INITIAL_LNG]);
  const [level, setLevel] = useState(INITIAL_LEVEL);
  const [areaName, setAreaName] = useState("");
  const [areas, setAreas] = useState([]);
  const [polygonExtractMode, setPolygonExtractMode] = useState(false);

  const areasJsonString = JSON.stringify(areas, null, 4);

  function handleAreaNameChange(e) {
    e.preventDefault();
    setAreaName(e.target.value);
  }

  const handleGeoJsonPolygonAdd = useCallback((geoJsonPolygon, center, level) => {
    if (!areaName) {
      alert("장소 이름을 적어주세요 :)");
      return;
    }

    const area = {
      name: areaName,
      location: geoJsonPolygon,
    };

    const newAreas = [...areas, area];

    setAreas(newAreas);
    setCenter([center.getLat(), center.getLng()]);
    setLevel(level);
    setAreaName("");
    setPolygonExtractMode(!polygonExtractMode);
  }, [areaName, areas, polygonExtractMode]);

  function handleGetPolygonBtnClick() {
    setPolygonExtractMode(!polygonExtractMode);
  }

  function handleCenterChange({ lat, lng, level }) {
    setCenter([lat, lng]);
    setLevel(level);
  }

  function onResultTextChange(resultText) {
    try {
      const jsonObj = JSON.parse(resultText);

      setAreas(jsonObj);
    } catch (err) {
      console.log(err);
      setAreas([...areas]);
    }
  }

  return (
    <div className="App">
      <Map
        center={center}
        level={level}
        polygonExtractMode={polygonExtractMode}
        onGeoJsonPolygonAdd={handleGeoJsonPolygonAdd}
        onCenterChange={handleCenterChange}
        areas={areas}
      />
      <AreaNameInput
        areaName={areaName}
        onAreaNameChange={handleAreaNameChange}
        polygonExtractMode={polygonExtractMode}
        onGetPolygonBtnClick={handleGetPolygonBtnClick}
      />
      <ResultTextArea
        resultText={areasJsonString}
        onResultTextChange={onResultTextChange}
      />
    </div>
  );
}

export default App;
