import React, { useRef } from 'react';
import { Box, Button } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import BlackWhite from './templates/BlackWhite';

export default function CVPreview({ data }) {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: (data?.personalInfo?.name ? `${data.personalInfo.name}-CV` : 'cv'),
        onBeforeGetContent: () => {
            // optional: can handle any last-minute changes
            return Promise.resolve();
        }
    });

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }} className="no-print">
                <Button variant="contained" color="primary" onClick={handlePrint}>
                    Download PDF
                </Button>
            </Box>

            <div>
                <div ref={componentRef}>
                    <BlackWhite data={data} />
                </div>
            </div>
        </Box>
    );
}
