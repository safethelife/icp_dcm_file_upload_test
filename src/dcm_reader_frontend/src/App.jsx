import { useNavigate } from 'react-router-dom';

function App() {
  let navigate = useNavigate();

  function handleButtonClick(buttonId) {
    switch (buttonId) {
      case 1:
        navigate('/QRScan'); // move to QR Scan page
        break;
      case 2:
        navigate('/upload'); // move to Data List page
        break;
      default:
        console.log(`Unknown Button ID: ${buttonId}`);
        break;
    }
  }
  return (
    <main style={{ textAlign: 'center' }}>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <div style={{ width: "80%", margin: "10px auto" }}>
        <button onClick={() => handleButtonClick(1)} style={{ width: "100%" }}>QR - Code Scan </button>
      </div>
      <div style={{ width: "80%", margin: "10px auto" }}>
        <button onClick={() => handleButtonClick(2)} style={{ width: "100%" }}>Upload</button>
      </div>
      <div style={{ width: "80%", margin: "10px auto" }}>
        <button onClick={() => handleButtonClick(3)} style={{ width: "100%" }}>Analysis Results</button>
      </div>
      <div style={{ width: "80%", margin: "10px auto" }}>
        <button onClick={() => handleButtonClick(4)} style={{ width: "100%" }}>Request Data</button>
      </div>
    </main>
  );
}

export default App;
