// src/pages/DcmViewer.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function DcmViewer() {
    const { filename } = useParams();
    const [fileData, setFileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchFileData() {
            try {
                const response = await fetch(`https://<your-canister-id>.ic0.app/api/get-file?filename=${filename}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch file');
                }
                const blob = await response.blob();
                setFileData(URL.createObjectURL(blob));
            } catch (error) {
                console.error('Error fetching file:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchFileData();
    }, [filename]);

    if (isLoading) return <div>Loading...</div>;
    if (!fileData) return <div>Error loading file.</div>;

    return (
        <div>
            <img src={fileData} alt={`File ${filename}`} />
        </div>
    );
}

export default DcmViewer;
