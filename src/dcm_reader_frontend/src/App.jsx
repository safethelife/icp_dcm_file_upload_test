import { useNavigate } from 'react-router-dom';

function App() {
  let navigate = useNavigate(); // 수정: useHistory에서 useNavigate로 변경

  function handleButtonClick(buttonId) {
    switch (buttonId) {
      case 1:
        navigate('/QRScan'); // QR Scan 페이지로 이동
        break;
      case 2:
        navigate('/upload'); // Data List 페이지로 이동
        break;
      // 추가 버튼에 대한 케이스를 여기에 구현
      default:
        console.log(`Unknown Button ID: ${buttonId}`);
        break;
    }
  }
  return (
    <main style={{ textAlign: 'center' }}> {/* 메인 태그에 텍스트 정렬 스타일 적용 */}
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <div style={{ width: "80%", margin: "10px auto" }}> {/* 각 버튼을 감싸는 div에 스타일 적용 */}
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
