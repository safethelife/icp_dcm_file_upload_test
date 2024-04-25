// src/pages/Upload.jsx
import React, { useState, useEffect } from 'react';
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as dcmUploaderIdl, canisterId as dcmUploaderCanisterId } from "declarations/dcm_reader_backend";

const agent = new HttpAgent({ host: "https://omnp4-sqaaa-aaaab-qab7q-cai.icp0.io/" });
const DcmUploader = Actor.createActor(dcmUploaderIdl, { agent, canisterId: dcmUploaderCanisterId });

function Upload() {
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            try {
                const result = await DcmUploader.uploadFile(file.name, uint8Array);
                alert(result); // alert the response from canister
                fetchFileList(); // if success, get the file list
            } catch (error) {
                if (error.message.includes('Code: 413')) {
                    alert('File is too big'); // in case the file's size is bigger than 2MB
                } else {
                    alert('Upload failed: ' + error.message); // another error message
                }
            }
        } else {
            alert('Please select a file first.');
        }
    };

    const fetchFileList = async () => {
        try {
            const files = await DcmUploader.listFiles();
            console.log("Received files:", files);  // check server response
            setFileList(files);
        } catch (error) {
            console.error("Error fetching file list:", error);
        }
    };
    
    useEffect(() => {
        fetchFileList(); // get the file list every componet mount 
    }, []);

    return (
        <div>
            <h2>Upload DCM File</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload to Canister</button>
            <div>
                <h3>Uploaded Files</h3>
                <ul>
                    {fileList.map((filename, index) => (
                        <li key={index}>
                        <a href={`/viewer/${filename}`}>{filename}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Upload;
