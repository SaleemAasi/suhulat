"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/store";
import {
  fetchBranches,
  createBranch,
  deleteBranch,
  updateBranch,
} from "@/store/slices/branchSlice";
import { fetchUsers } from "@/store/slices/userSlice";
import { fetchStore } from "@/store/slices/storeSlice"; 
import { Branch } from "@/services/branchService";

export default function BranchesPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { list: branches, loading: branchLoading } = useSelector(
    (state: RootState) => state.branches
  );
  const { list: users, loading: userLoading } = useSelector(
    (state: RootState) => state.users
  );
  const { store, loading: storeLoading } = useSelector(
    (state: RootState) => state.storeData
  );

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: "", name: "", manager: "" });

  useEffect(() => {
    dispatch(fetchStore());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (store?._id) {
      dispatch(fetchBranches(store._id));
    }
  }, [dispatch, store]);

  const managers = users.filter((u) => u.role === "Manager");

  const handleSave = async () => {
    if (!form.name || !form.manager) {
      console.warn("Branch name or manager is missing!");
      return;
    }

    if (!store?._id) {
      console.error("❌ No store found. Cannot create/update branch.");
      return;
    }

    try {
      if (form.id) {
        await dispatch(
          updateBranch({
            storeId: store._id,
            id: form.id,
            data: { name: form.name, manager: form.manager },
          })
        ).unwrap();
      } else {
        await dispatch(
          createBranch({
            storeId: store._id,
            name: form.name,
            manager: form.manager,
          })
        ).unwrap();
      }

      setOpen(false);
      setForm({ id: "", name: "", manager: "" });
    } catch (err) {
      console.error("Error saving branch:", err);
    }
  };

  const handleEdit = (branch: Branch) => {
    setForm({
      id: branch._id,
      name: branch.name,
      manager:
        typeof branch.manager === "string"
          ? branch.manager
          : branch.manager?._id || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!store?._id) {
      console.error("❌ No store found. Cannot delete branch.");
      return;
    }

    await dispatch(deleteBranch({ storeId: store._id, id }));
  };

  if (branchLoading || userLoading || storeLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2.5 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2.5}>
        <Typography variant="h5" fontWeight="bold">
          Branches
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Branch
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Branch Manager</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {branches.map((b) => (
              <TableRow key={b._id}>
                <TableCell>{b.name}</TableCell>
                <TableCell>
                  {typeof b.manager === "object"
                    ? b.manager?.name
                    : "Not assigned"}
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleEdit(b)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(b._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>
          {form.id ? "Edit Branch" : "Add Branch"}
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <TextField
              fullWidth
              variant="outlined"
              label="Branch Name"
              placeholder="Enter branch name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              InputLabelProps={{ shrink: !!form.name }}
            />

            <FormControl fullWidth>
              <InputLabel shrink>Manager</InputLabel>
              <Select
                displayEmpty
                value={form.manager}
                onChange={(e) => setForm({ ...form, manager: e.target.value })}
                renderValue={(selected) =>
                  selected
                    ? users.find((u) => u._id === selected)?.name
                    : "Select a Manager"
                }
                sx={{ borderRadius: 2 }}
              >
                {managers.length === 0 ? (
                  <MenuItem disabled>No managers available</MenuItem>
                ) : (
                  managers.map((m) => (
                    <MenuItem key={m._id} value={m._id}>
                      {m.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              fontWeight: "bold",
            }}
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
