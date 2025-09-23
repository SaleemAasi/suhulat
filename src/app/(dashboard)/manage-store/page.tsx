"use client";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function ManageStorePage() {
  return (
    <Box sx={{ p: { xs: 0.5, md: 0.5 } }}>
      {/* Title */}
      <Typography variant="body1" fontWeight="bold">
        Manage Store
      </Typography>
      <Typography variant="caption" color="text.secondary" mb={1}>
        Add store image, general info, and contact details.
      </Typography>

      {/* Image Upload Section */}
      <Paper
        variant="outlined"
        sx={{
          p: 1,
          textAlign: "center",
          borderStyle: "dashed",
          borderRadius: 2,
          mb: 1,
          bgcolor: "grey.50",
        }}
      >
        <CloudUploadIcon
          sx={{ fontSize: 30, color: "primary.main" }}
        />
        <Typography variant="body2" fontWeight={500}>
          Upload Store Photo
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Drag & drop image here, or click to upload
        </Typography>
        <Button variant="contained" component="label" size="small" sx={{ mt: 1, fontSize: 10 }}>
          Add Image
          <input type="file" hidden />
        </Button>
      </Paper>

      {/* General Information */}
      <Paper variant="outlined" sx={{ p: 1, borderRadius: 2, mb: 1 }}>
        <Typography variant="body2" fontWeight="bold">
          General Information
        </Typography>
        <Stack spacing={0.5}>
          <TextField
            label="Store Name"
            placeholder="Type store name here..."
            fullWidth
            size="small"
          />
          <TextField
            label="Description"
            placeholder="Type store description here..."
            fullWidth
            multiline
            rows={2}
            size="small"
          />
        </Stack>
      </Paper>

      {/* Contact Info */}
      <Paper variant="outlined"  sx={{ p: 1, borderRadius: 2, mb: 1 }}>
        <Typography variant="body2" fontWeight="bold">
          Contact Information
        </Typography>
        <Stack spacing={0.5}>
          <TextField
            label="Phone Number"
            placeholder="Enter phone number..."
            fullWidth
            size="small"
          />
          <TextField
            label="Postal Address"
            placeholder="Enter postal address..."
            fullWidth
            size="small"
          />
          <TextField
            label="Email Address"
            placeholder="Enter email address..."
            fullWidth
            size="small"
          />
          <TextField
            label="Website"
            placeholder="Enter website URL..."
            fullWidth
            size="small"
          />
          <TextField
            label="Facebook"
            placeholder="Enter Facebook page link..."
            fullWidth
            size="small"
          />
          <TextField
            label="Instagram Handle"
            placeholder="Enter Instagram username..."
            fullWidth
            size="small"
          />
          <TextField
            label="X Handle"
            placeholder="Enter X (Twitter) username..."
            fullWidth
            size="small"
          />
          <TextField
            label="TikTok Handle"
            placeholder="Enter TikTok username..."
            fullWidth
            size="small"
          />
        </Stack>
      </Paper>

      {/* Buttons */}
      <Box display="flex" justifyContent="flex-end" gap={0.5}>
        <Button variant="outlined" color="error" size="small">
          Cancel
        </Button>
        <Button variant="contained" color="primary" size="small">
          Save
        </Button>
      </Box>
    </Box>
  );
}