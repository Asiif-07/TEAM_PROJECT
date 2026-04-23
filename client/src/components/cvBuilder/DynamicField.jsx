import React from "react";
import { TextField, Checkbox, FormControlLabel, Grid } from "@mui/material";

export default function DynamicField({ field, value, onChange }) {
    const { type, label, name, required, placeholder, grid = 12 } = field;

    const handleChange = (e) => {
        const val = type === "checkbox" ? e.target.checked : e.target.value;
        onChange(name, val);
    };

    const commonProps = {
        fullWidth: true,
        label,
        name,
        required,
        placeholder: placeholder || "",
        value: value || "",
        onChange: handleChange,
        size: "small",
        variant: "outlined",
        sx: {
            "& .MuiOutlinedInput-root": { borderRadius: "12px" },
            mt: 2
        }
    };

    return (
        <Grid item xs={12} sm={grid}>
            {type === "textarea" && <TextField {...commonProps} multiline rows={4} />}
            {type === "text" && <TextField {...commonProps} />}
            {type === "email" && <TextField {...commonProps} type="email" />}
            {type === "phone" && <TextField {...commonProps} type="tel" />}
            {type === "date" && <TextField {...commonProps} type="date" InputLabelProps={{ shrink: true }} />}
            {type === "checkbox" && (
                <FormControlLabel
                    control={<Checkbox checked={!!value} onChange={handleChange} color="primary" />}
                    label={label}
                    sx={{ mt: 2 }}
                />
            )}
        </Grid>
    );
}
