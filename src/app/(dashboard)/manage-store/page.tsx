"use client";

import { Box, Button, TextField, Typography, Paper, Stack, Alert, Divider } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { fetchStore, saveStore } from "@/store/slices/storeSlice";
import { useEffect, useState } from "react";

export default function ManageStorePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { store, loading, error } = useSelector((state: RootState) => state.storeData);

  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    facebook: "",
    instagram: "",
    twitter: "",
    tiktok: "",
    logoBase64: "",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchStore());
  }, [dispatch]);

  useEffect(() => {
    if (store) {
      setFormData({
        storeName: store.storeName || "",
        description: store.description || "",
        phone: store.phone || "",
        email: store.email || "",
        address: store.address || "",
        website: store.website || "",
        facebook: store.facebook || "",
        instagram: store.instagram || "",
        twitter: store.twitter || "",
        tiktok: store.tiktok || "",
        logoBase64: "",
      });
      setLogoPreview(store.logoUrl || null);
    }
  }, [store]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result?.toString().split(",")[1] || "";
        setFormData({ ...formData, logoBase64: base64 });
        setLogoPreview(URL.createObjectURL(file));
        setStatusMsg("✅ Logo ready to upload");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg("⏳ Saving store...");
    try {
      await dispatch(saveStore(formData)).unwrap();
      setStatusMsg("✅ Store saved successfully");
    } catch (err: any) {
      setStatusMsg(`❌ Failed to save store: ${err.message || err}`);
    }
  };

  const handleCancel = () => {
    if (store) {
      setFormData({
        storeName: store.storeName || "",
        description: store.description || "",
        phone: store.phone || "",
        email: store.email || "",
        address: store.address || "",
        website: store.website || "",
        facebook: store.facebook || "",
        instagram: store.instagram || "",
        twitter: store.twitter || "",
        tiktok: store.tiktok || "",
        logoBase64: "",
      });
      setLogoPreview(store.logoUrl || null);
      setStatusMsg("↩️ Changes canceled");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Manage Store
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Update your store details, contact information, and logo.
      </Typography>

      {statusMsg && (
        <Alert severity={statusMsg.includes("❌") ? "error" : "success"} sx={{ mb: 2 }}>
          {statusMsg}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Logo Upload - Clickable Area */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mb: 3,
          textAlign: "center",
          borderStyle: "dashed",
          borderRadius: 3,
          bgcolor: "grey.50",
          position: "relative",
          cursor: "pointer",
          "&:hover": { bgcolor: "grey.100" },
        }}
        onClick={() => document.getElementById("logoInput")?.click()}
      >
        {logoPreview ? (
          <img
            src={logoPreview}
            alt="Store Logo"
            style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 12 }}
          />
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Click here to upload logo
            </Typography>
            <CloudUploadIcon sx={{ fontSize: 40, color: "primary.main", mt: 1 }} />
          </>
        )}
        <input type="file" id="logoInput" hidden onChange={handleFile} />
      </Paper>

      <Divider sx={{ mb: 3 }} />

      {/* General Information */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          General Information
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Store Name"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            size="small"
          />
        </Stack>
      </Paper>

      {/* Contact Information */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={2}>
          Contact Information
        </Typography>
        <Stack spacing={2}>
          <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth size="small" />
          <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth size="small" />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth size="small" />
          <TextField label="Website" name="website" value={formData.website} onChange={handleChange} fullWidth size="small" />
          <TextField label="Facebook" name="facebook" value={formData.facebook} onChange={handleChange} fullWidth size="small" />
          <TextField label="Instagram" name="instagram" value={formData.instagram} onChange={handleChange} fullWidth size="small" />
          <TextField label="X Handle" name="twitter" value={formData.twitter} onChange={handleChange} fullWidth size="small" />
          <TextField label="TikTok" name="tiktok" value={formData.tiktok} onChange={handleChange} fullWidth size="small" />
        </Stack>
      </Paper>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" color="error" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}
