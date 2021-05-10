import { useEffect, useState } from "react";
import "./index.css";

export default function ResultTextArea({ resultText, onResultTextChange }) {
  const [text, setText] = useState(resultText);

  useEffect(() => {
    setText(resultText);
  }, [resultText])

  function handleTextChange(e) {
    setText(e.target.value);
    onResultTextChange(e.target.value);
  }

  function handleCopyBtnClick() {
    navigator.clipboard.writeText(resultText).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  }

  function handleChangeLatLngBtnClick() {
    const areas = JSON.parse(resultText);

    for (const area of areas) {
      area.location.coordinates[0] = area.location.coordinates[0].map((latLng) => [latLng[1], latLng[0]]);
    }

    setText(JSON.stringify(areas, null, 4));
  }

  return (
    <div className="resultTextAreaWrapper">
      <textarea value={text} onChange={handleTextChange}></textarea>
      <button className="copyBtn" onClick={handleCopyBtnClick}>copy</button>
      <button onClick={handleChangeLatLngBtnClick}>changeLatLng</button>
    </div>
  );
}
