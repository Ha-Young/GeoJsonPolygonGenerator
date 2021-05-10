import "./index.css";

export default function ResultTextArea({ resultText }) {
  console.log("rerender", resultText);

  function handleTextChange(e) {
    e.preventDefault();
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
      <textarea value={resultText} onChange={handleTextChange}></textarea>
      <button className="copyBtn" onClick={handleCopyBtnClick}>copy</button>
    </div>
  );
}
