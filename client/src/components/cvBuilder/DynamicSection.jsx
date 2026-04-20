import React from "react";
import { Box, Typography, Button, Grid, IconButton, Paper } from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import DynamicField from "./DynamicField";

export default function DynamicSection({
    title,
    schema,
    data,
    onChange,
    onAdd,
    onRemove
}) {
    if (!schema) return null;

    // Handle Repeatable Sections (Array)
    if (schema.repeatable) {
        return (
            <Box sx={{ mb: 6 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" fontWeight="800" color="primary">{title}</Typography>
                    <Button
                        startIcon={<Plus size={18} />}
                        onClick={onAdd}
                        variant="soft"
                        sx={{ borderRadius: "10px", fontWeight: 700 }}
                    >
                        Add {title.replace(/s$/, '')}
                    </Button>
                </Box>

                {(data || []).map((item, index) => (
                    <Paper
                        key={index}
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            border: "1px solid rgba(0,0,0,0.05)",
                            borderRadius: "20px",
                            position: "relative",
                            bgcolor: "rgba(255,255,255,0.4)"
                        }}
                    >
                        {data.length > 1 && (
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => onRemove(index)}
                                sx={{ position: "absolute", top: 12, right: 12 }}
                            >
                                <Trash2 size={16} />
                            </IconButton>
                        )}
                        <Grid container spacing={2}>
                            {schema.fields.map((field) => (
                                <DynamicField
                                    key={field.name}
                                    field={field}
                                    value={item[field.name]}
                                    onChange={(name, val) => onChange(index, name, val)}
                                />
                            ))}
                        </Grid>
                    </Paper>
                ))}
            </Box>
        );
    }

    // Handle Simple Sections (Object)
    return (
        <Box sx={{ mb: 6 }}>
            <Typography variant="h6" fontWeight="800" color="primary" sx={{ mb: 2 }}>{title}</Typography>
            <Grid container spacing={2}>
                {schema.map((field) => (
                    <DynamicField
                        key={field.name}
                        field={field}
                        value={data[field.name]}
                        onChange={(name, val) => onChange(null, name, val)}
                    />
                ))}
            </Grid>
        </Box>
    );
}
