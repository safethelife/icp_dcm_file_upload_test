import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function QRScan() {
  const [downloadUrl, setDownloadUrl] = useState('');
  const [showModal, setShowModal] = useState(false);


  const handleDownload = () => {
    // 사용자가 모달에서 'Yes'를 클릭하면 새 창에서 링크를 엽니다.
    window.open(downloadUrl, '_blank');
    setShowModal(false); // 모달창을 숨깁니다.
  };

  const handleCancel = () => {
    setShowModal(false); // 모달창을 숨깁니다.
  };

  useEffect(() => {
    const qrScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 }, false);
    
    const onScanSuccess = (decodedText, decodedResult) => {
      console.log(`QR Code detected: ${decodedText}`, decodedResult);
      setDownloadUrl(decodedText);  // 다운로드 URL을 상태에 저장
      setShowModal(true);  // 모달창을 표시합니다.
    };

    const onScanError = (error) => {
      console.error(`QR Code scan error: ${error}`);
    };

    qrScanner.render(onScanSuccess, onScanError);

    return () => qrScanner.clear();  // 스캐너 정리
  }, []);

  useEffect(() => {
    if (downloadUrl) {
      downloadFile(downloadUrl);  // URL 상태가 업데이트 되면 파일 다운로드
    }
  }, [downloadUrl]);  // downloadUrl이 변경될 때마다 이펙트 실행


const downloadFile = (url) => {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.blob();
    })
    .then(blob => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;
        if (window.confirm('Do you want to save the file to local database?')) {
          saveFileToIndexedDB(arrayBuffer, 'downloaded_file.dcm');
        }
      };
      reader.readAsArrayBuffer(blob);
    })
    .catch(e => {
      console.error('Download failed:', e);
    });
};

const saveFileToIndexedDB = (arrayBuffer, filename) => {
  const request = indexedDB.open('FilesDB', 1);
  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('files')) {
      db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
    }
  };
  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction('files', 'readwrite');
    const store = transaction.objectStore('files');
    const fileRecord = { filename, file: arrayBuffer };
    const addRequest = store.add(fileRecord);
    addRequest.onsuccess = () => console.log('File saved to IndexedDB successfully!');
    addRequest.onerror = () => console.error('Error saving file to IndexedDB:', addRequest.error);
  };
  request.onerror = (event) => console.error('Database error:', event.target.error);
};


  return (
    <div style={{ textAlign: 'center' }}>
      <div id="qr-reader" style={{ width: "80%", height: "70&", margin: "10px auto" }}></div>
      {showModal && (
        <div className="modal">
          <p>Would you like to download the file?</p>
          <button onClick={handleDownload}>Yes</button>
          <button onClick={handleCancel}>No</button>
        </div>
      )}
    </div>
  );
}

export default QRScan;
