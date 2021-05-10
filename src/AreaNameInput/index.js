import "./index.css";

export default function AreaNameInput({ areaName, onAreaNameChange }) {
  return (
    <div className="areaNameInputWrapper">
      <label htmlFor="areaName">추가할 장소 이름</label>
      <input name="areaName" value={areaName} onChange={onAreaNameChange} />
    </div>
  );
}
