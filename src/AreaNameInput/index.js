import Information from "../Information";
import "./index.css";

export default function AreaNameInput({
  areaName,
  onAreaNameChange,
  polygonExtractMode,
  onGetPolygonBtnClick,
}) {
  return (
    <>
    <div className="areaNameInputWrapper">
      <label htmlFor="areaName">추가할 장소 이름</label>
      <input name="areaName" value={areaName} onChange={onAreaNameChange} />
      <button onClick={onGetPolygonBtnClick}>{polygonExtractMode ? "추출 종료하기" : "추출 하기"}</button>
    </div>
    {polygonExtractMode && <Information />}
    </>
  );
}
