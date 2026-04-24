import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Box } from "@mui/material";

const CVRenderer = forwardRef(({ children, userName = "User" }, ref) => {
    const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `${userName}_Resume`,
        onAfterPrint: () => console.log("Printed successfully"),
    });

    // Expose handlePrint to parent component
    useImperativeHandle(ref, () => ({
        handlePrint
    }));

    return (
        <Box
            ref={componentRef}
            sx={{
                width: "210mm",
                minHeight: "297mm",
                bgcolor: "white",
                margin: "0 auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                position: "relative",
                overflow: "hidden"
            }}
            className="cv-document"
        >
            {children}
        </Box>
    );
});

export default CVRenderer;
