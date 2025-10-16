"use client";

import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { createUser, fetchUsers, updateUser, deleteUser } from "../store/slices/userSlice";
import { User as UserType } from "../services/userService";

interface UsersTableProps {
  title: string;
}

const getRoleFromTitle = (title: string) => {
  if (title.toLowerCase().includes("manager")) return "Manager";
  if (title.toLowerCase().includes("owner")) return "Owner";
  if (title.toLowerCase().includes("cashier")) return "Cashier";
  return title;
};

export default function UsersTable({ title }: UsersTableProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector((state: RootState) => state.users);

  const [open, setOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const role = getRoleFromTitle(title);
      const payload = { ...formData, role } as UserType;

      if (editUserId) {
        await dispatch(updateUser({ id: editUserId, data: payload })).unwrap();
      } else {
        await dispatch(createUser(payload)).unwrap();
      }

      dispatch(fetchUsers());
      setOpen(false);
      setFormData({ name: "", phone: "", email: "", password: "" });
      setEditUserId(null);
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handleEdit = (user: UserType) => {
    setFormData({
      name: user.name,
      phone: user.phone,
      email: user.email,
      password: "",
    });
    setEditUserId(user._id || user.id || null);
    setOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await dispatch(deleteUser(id)).unwrap();
      dispatch(fetchUsers());
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const users = list.filter(
    (u) => u.role?.toLowerCase() === getRoleFromTitle(title).toLowerCase()
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">{title}</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 3, px: 3, py: 1.2, fontWeight: "bold" }}
        >
          Add {getRoleFromTitle(title)}
        </Button>
      </Box>

      {/* Table */}
      <Paper sx={{ borderRadius: 3, boxShadow: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Phone Number</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email Address</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id || user.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar src={user.avatar || "/avatar.png"} sx={{ width: 30, height: 30 }} />
                        <Typography>{user.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => handleEdit(user)}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(user._id || user.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dialog */}
      <Dialog open={open} onClose={() => { setOpen(false); setEditUserId(null); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>
          {editUserId ? `Edit ${getRoleFromTitle(title)}` : `Add ${getRoleFromTitle(title)}`}
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <TextField label="Name" name="name" fullWidth value={formData.name} onChange={handleChange} />
            <TextField label="Phone Number" name="phone" fullWidth value={formData.phone} onChange={handleChange} />
            <TextField label="Email" name="email" type="email" fullWidth value={formData.email} onChange={handleChange} />
            <TextField label="Password" name="password" type="password" fullWidth value={formData.password} onChange={handleChange} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setOpen(false); setEditUserId(null); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{editUserId ? "Update" : "Save"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
