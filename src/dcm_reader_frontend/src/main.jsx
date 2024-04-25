import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'; // v6에서는 Routes를 사용
import App from './App';
import QRScan from './pages/QRScan';
import Upload from './pages/Upload';
import DcmViewer from './pages/DcmViewer';
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/qrscan" element={<QRScan />} />
        <Route path='/upload' element={<Upload/>}/>
        <Route path="/viewer/:filename" element={<DcmViewer />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
