"use client";

import {
  Box,
  Button,
  Checkbox,
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
import { Branch } from "@/services/branchService";

export default function BranchesPage() {
  const dispatch = useDispatch<AppDispatch>();
const { loading: branchLoading } = useSelector(
  (state: RootState) => state.branches
);
  const { list: users, loading: userLoading } = useSelector(
    (state: RootState) => state.users
  );

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: "", name: "", manager: "" });
  const [branchesWithManager, setBranchesWithManager] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const branchesRes = await dispatch(fetchBranches()).unwrap();
      await dispatch(fetchUsers()).unwrap();

      const mappedBranches = branchesRes.map((b: any) => ({
        ...b,
        managerName: b.manager?.name || "Not assigned",
        managerId: b.manager?._id || b.manager, 
      }));
      setBranchesWithManager(mappedBranches);
    };

    fetchData();
  }, [dispatch]);

  const managers = users.filter((u) => u.role === "Manager");

  const handleSave = async () => {
    console.log("Saving branch:", form);

    if (!form.name || !form.manager) {
      console.warn("Branch name or manager is missing!");
      return;
    }

    try {
      let savedBranch;
      if (form.id) {
        savedBranch = await dispatch(
          updateBranch({
            id: form.id,
            data: { name: form.name, manager: form.manager },
          })
        ).unwrap();
     
      } else {
        savedBranch = await dispatch(
          createBranch({ name: form.name, manager: form.manager })
        ).unwrap();
     
      }

  
      const branchWithManagerName = {
        ...savedBranch,
        managerName: savedBranch.manager?.name || "Not assigned",
        managerId: savedBranch.manager?._id || savedBranch.manager,
      };

      setBranchesWithManager((prev) => {
        if (form.id) {
          return prev.map((b) =>
            b._id === savedBranch._id ? branchWithManagerName : b
          );
        } else {
          return [...prev, branchWithManagerName];
        }
      });

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
    manager: branch.manager || "", 
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteBranch(id));
    setBranchesWithManager((prev) => prev.filter((b) => b._id !== id));
  };

  if (branchLoading || userLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2.5 }}>
      <Box display="flex" justifyContent="space-between" mb={2.5}>
        <Typography variant="h5" fontWeight="bold">
          Branches
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Branch
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Branch Manager</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {branchesWithManager.map((b) => (
              <TableRow key={b._id}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>{b.name}</TableCell>
                <TableCell>{b.managerName}</TableCell>
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

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{form.id ? "Edit Branch" : "Add Branch"}</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <TextField
              label="Branch Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Manager</InputLabel>
              <Select
                value={form.manager}
                onChange={(e) => setForm({ ...form, manager: e.target.value })}
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
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
