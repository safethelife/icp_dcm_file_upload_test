import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function QRScan() {
  const [downloadUrl, setDownloadUrl] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Handler to open the download URL in a new tab and close the modal
  const handleDownload = () => {
    window.open(downloadUrl, '_blank');
    setShowModal(false);
  };

  // Handler to close the modal without taking any action
  const handleCancel = () => {
    setShowModal(false);
  };

  // Effect to initialize QR code scanner on component mount
  useEffect(() => {
    const qrScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 }, false);
    
    const onScanSuccess = (decodedText, decodedResult) => {
      console.log(`QR Code detected: ${decodedText}`, decodedResult);
      setDownloadUrl(decodedText);
      setShowModal(true);
    };

    const onScanError = (error) => {
      console.error(`QR Code scan error: ${error}`);
    };

    qrScanner.render(onScanSuccess, onScanError);

    return () => qrScanner.clear();
  }, []);

  // Effect to download file when download URL is set
  useEffect(() => {
    if (downloadUrl) {
      downloadFile(downloadUrl);
    }
  }, [downloadUrl]);

  // Function to download file and prompt user to save to IndexedDB
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

  // Function to save file to IndexedDB
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
      <div id="qr-reader" style={{ width: "80%", height: "70%", margin: "10px auto" }}></div>
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
