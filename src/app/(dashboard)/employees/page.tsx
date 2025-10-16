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
import { AppDispatch, RootState } from "@/store/index";
import {
  fetchEmployees,
  addEmployee,
  editEmployee,
  removeEmployee,
} from "@/store/slices/employeeSlice";

export default function EmployeesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector((state: RootState) => state.employees);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    salary: "",
    designation: "",
  });

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await dispatch(editEmployee({ id: editId, data: form })).unwrap();
      } else {
        await dispatch(addEmployee(form)).unwrap();
      }
      setForm({ name: "", email: "", salary: "", designation: "" });
      setEditId(null);
      setOpen(false);
      dispatch(fetchEmployees());
    } catch (err) {
      console.error("Error saving employee:", err);
    }
  };

  const handleEdit = (emp: any) => {
    setForm({
      name: emp.name,
      email: emp.email,
      salary: emp.salary,
      designation: emp.designation,
    });
    setEditId(emp._id);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
      await dispatch(removeEmployee(id)).unwrap();
      dispatch(fetchEmployees());
    } catch (err) {
      console.error("Error deleting employee:", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Employees
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 3, px: 3, py: 1.2, fontWeight: "bold" }}
        >
          Add Employee
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
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Salary</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Designation</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((emp: any) => (
                  <TableRow key={emp._id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar src="/avatar.png" sx={{ width: 30, height: 30 }} />
                        <Typography>{emp.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{emp.email}</TableCell>

                    {/* ✅ Salary in PKR (₨) */}
                    <TableCell>
                      {new Intl.NumberFormat("en-PK", {
                        style: "currency",
                        currency: "PKR",
                        maximumFractionDigits: 0, // remove decimals
                      }).format(Number(emp.salary))}
                    </TableCell>

                    <TableCell>{emp.designation}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleEdit(emp)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(emp._id)}>
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
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editId ? "Edit Employee" : "Add Employee"}
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={form.name}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              label="Salary (PKR)"
              name="salary"
              fullWidth
              value={form.salary}
              onChange={handleChange}
            />
            <TextField
              label="Designation"
              name="designation"
              fullWidth
              value={form.designation}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
