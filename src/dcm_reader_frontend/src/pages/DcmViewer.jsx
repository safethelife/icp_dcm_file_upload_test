import React, { useEffect, useRef } from 'react';
import dwv from 'dwv';

// Load specific decoders
import 'dwv/decoders/pdfjs/jpx.js';
import 'dwv/decoders/pdfjs/util.js';
import 'dwv/decoders/pdfjs/arithmetic_decoder.js';
import 'dwv/decoders/pdfjs/jpg.js';

function DcmViewer({ fileBlob }) {
    const dwvApp = useRef(null);
    const element = useRef(null);

    useEffect(() => {
        // Initialize DWV
        dwvApp.current = new dwv.App();
        // Initialize the DWV app with the container div
        dwvApp.current.init({
            containerDivId: element.current.id,
            tools: ['Scroll', 'ZoomAndPan', 'WindowLevel', 'Draw'],
            isMobile: /Mobi/.test(navigator.userAgent)
        });

        // Load the blob
        if (fileBlob) {
            const fileArray = [new File([fileBlob], "dicom.dcm")];
            dwvApp.current.loadFiles(fileArray);
        }

        return () => {
            if (dwvApp.current) {
                dwvApp.current.destroy();
            }
        };
    }, [fileBlob]);

    return <div id="dwv-container" ref={element} style={{ width: '100%', height: '512px' }}></div>;
}

export default DcmViewer;

