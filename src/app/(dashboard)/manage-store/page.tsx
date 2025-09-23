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
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { fetchStore, saveStore } from "@/store/slices/storeSlice";
import { useEffect, useState } from "react";

export default function ManageStorePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { store, loading } = useSelector((state: RootState) => state.storeData);

  const ownerId = "user123"; // Replace with real auth userId

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
    logo: null as File | null,
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // -----------------------------
  // Fetch store on mount
  // -----------------------------
  useEffect(() => {
    console.log("🔹 Fetching store for user:", ownerId);
    dispatch(fetchStore(ownerId));
  }, [dispatch, ownerId]);

  // -----------------------------
  // Populate form when store exists
  // -----------------------------
  useEffect(() => {
    if (store) {
      console.log("✅ Store fetched from backend:", store);

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
        logo: null,
      });

      if (store.logoUrl) {
        console.log("🖼 Logo URL from backend:", store.logoUrl);
        setLogoPreview(store.logoUrl.startsWith("http") ? store.logoUrl : `/uploads/${store.logoUrl}`);
      } else {
        console.log("⚠️ No logo found for this store");
        setLogoPreview(null);
      }
    }
  }, [store]);

  // -----------------------------
  // Handle input change
  // -----------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // Handle file upload
  // -----------------------------
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      console.log("📤 File selected for upload:", file);
      setFormData({ ...formData, logo: file });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // -----------------------------
  // Handle form submit
  // -----------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) fd.append(key, value as any);
    });
    console.log("📩 Submitting formData:", formData);
    dispatch(saveStore({ userId: ownerId, formData: fd }));
  };

  // -----------------------------
  // Handle cancel: reset form
  // -----------------------------
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
        logo: null,
      });
      setLogoPreview(store.logoUrl || null);
    }
  };

  return (
    <Box sx={{ p: { xs: 0.5, md: 0.5 } }}>
      <Typography variant="body1" fontWeight="bold">
        Manage Store
      </Typography>
      <Typography variant="caption" color="text.secondary" mb={1}>
        Add store image, general info, and contact details.
      </Typography>

      {/* Image Upload */}
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
        {logoPreview ? (
          <img
            src={logoPreview}
            alt="Store Logo"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              marginBottom: 8,
              borderRadius: 8,
            }}
          />
        ) : (
          <Typography variant="caption" color="text.secondary" mb={1}>
            No logo uploaded yet
          </Typography>
        )}

        <CloudUploadIcon sx={{ fontSize: 30, color: "primary.main" }} />
        <Typography variant="body2" fontWeight={500}>
          Upload Store Photo
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Drag & drop image here, or click to upload
        </Typography>

        <Button
          variant="contained"
          component="label"
          size="small"
          sx={{ mt: 1, fontSize: 10 }}
        >
          Add Image
          <input type="file" hidden onChange={handleFile} />
        </Button>
      </Paper>

      {/* General Info */}
      <Paper variant="outlined" sx={{ p: 1, borderRadius: 2, mb: 1 }}>
        <Typography variant="body2" fontWeight="bold">
          General Information
        </Typography>
        <Stack spacing={0.5}>
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
            rows={2}
            size="small"
          />
        </Stack>
      </Paper>

      {/* Contact Info */}
      <Paper variant="outlined" sx={{ p: 1, borderRadius: 2, mb: 1 }}>
        <Typography variant="body2" fontWeight="bold">
          Contact Information
        </Typography>
        <Stack spacing={0.5}>
          <TextField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Postal Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Facebook"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="Instagram Handle"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="X Handle"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            fullWidth
            size="small"
          />
          <TextField
            label="TikTok Handle"
            name="tiktok"
            value={formData.tiktok}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Stack>
      </Paper>

      {/* Buttons */}
      <Box display="flex" justifyContent="flex-end" gap={0.5}>
        <Button variant="outlined" color="error" size="small" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
}
