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

  return (
    <div className="resultTextAreaWrapper">
      <textarea value={text} onChange={handleTextChange}></textarea>
      <button className="copyBtn" onClick={handleCopyBtnClick}>copy</button>
    </div>
  );
}
