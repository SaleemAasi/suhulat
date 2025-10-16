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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/index";
import {
  fetchSalaries,
  createSalary,
  editSalary,
  removeSalary,
} from "@/store/slices/salarySlice"; // ✅ Fixed
import { fetchEmployees } from "@/store/slices/employeeSlice";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function EmployeeSalaryPage() {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const { list: employees, loading: empLoading } = useSelector(
    (state: RootState) => state.employees
  );
  const { list: salaries, loading: salLoading } = useSelector(
    (state: RootState) => state.salaries
  );

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    designation: "",
    basicSalary: "",
    bonus: "",
    advance: "",
    deductions: "",
    month: "",
  });

  // ✅ Fetch employees & salaries
  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchSalaries());
  }, [dispatch]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle employee selection (auto-fill)
  const handleEmployeeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const empId = e.target.value;
    const selectedEmp = employees.find((emp: any) => emp._id === empId);
    if (selectedEmp) {
      setForm({
        ...form,
        employeeId: empId,
        name: selectedEmp.name,
        designation: selectedEmp.designation,
        basicSalary: selectedEmp.salary,
      });
    }
  };

  // ✅ Save or Update salary
  const handleSave = async () => {
    const newSalary = {
      ...form,
      basicSalary: Number(form.basicSalary),
      bonus: Number(form.bonus) || 0,
      advance: Number(form.advance) || 0,
      deductions: Number(form.deductions) || 0,
    };

    if (editId) {
      await dispatch(editSalary({ id: editId, data: newSalary }));
    } else {
      await dispatch(createSalary(newSalary));
    }

    setForm({
      employeeId: "",
      name: "",
      designation: "",
      basicSalary: "",
      bonus: "",
      advance: "",
      deductions: "",
      month: "",
    });
    setEditId(null);
    setOpen(false);
    dispatch(fetchSalaries()); // refresh list
  };

  // ✅ Edit existing salary
  const handleEdit = (record: any) => {
    setForm(record);
    setEditId(record._id);
    setOpen(true);
  };

  // ✅ Delete salary record
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      await dispatch(removeSalary(id));
      dispatch(fetchSalaries());
    }
  };

  // Calculate Net Salary
  const calculateNetSalary = () => {
    const { basicSalary, bonus, advance, deductions } = form;
    return (
      (Number(basicSalary) || 0) +
      (Number(bonus) || 0) -
      (Number(advance) || 0) -
      (Number(deductions) || 0)
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Employee Salary Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 3, px: 3, py: 1.2, fontWeight: "bold" }}
        >
          Add Salary
        </Button>
      </Box>

      {/* Table */}
      <Paper sx={{ borderRadius: 3, boxShadow: 3 }}>
        {empLoading || salLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Month</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Designation</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Basic Salary</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Bonus</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Advance</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Deductions</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Net Salary</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {salaries.map((r: any) => {
                  const netSalary =
                    r.basicSalary + r.bonus - r.advance - r.deductions;
                  return (
                    <TableRow key={r._id}>
                      <TableCell>{r.month}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.designation}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-PK", {
                          style: "currency",
                          currency: "PKR",
                          maximumFractionDigits: 0,
                        }).format(r.basicSalary)}
                      </TableCell>
                      <TableCell>{r.bonus}</TableCell>
                      <TableCell>{r.advance}</TableCell>
                      <TableCell>{r.deductions}</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "green" }}>
                        {new Intl.NumberFormat("en-PK", {
                          style: "currency",
                          currency: "PKR",
                          maximumFractionDigits: 0,
                        }).format(netSalary)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleEdit(r)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(r._id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editId ? "Edit Salary Record" : "Add Salary Record"}
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            {/* Employee Dropdown */}
            <TextField
              select
              label="Select Employee"
              name="employeeId"
              value={form.employeeId}
              onChange={handleEmployeeSelect}
              fullWidth
            >
              {employees.map((emp: any) => (
                <MenuItem key={emp._id} value={emp._id}>
                  {emp.name} — {emp.designation}
                </MenuItem>
              ))}
            </TextField>

            {/* Month Picker */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year", "month"]}
                label="Select Month"
                value={form.month ? dayjs(form.month, "MMMM YYYY") : null}
                onChange={(newValue: Dayjs | null) => {
                  setForm({
                    ...form,
                    month: newValue ? newValue.format("MMMM YYYY") : "",
                  });
                }}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>

            <TextField
              label="Designation"
              name="designation"
              fullWidth
              value={form.designation}
              onChange={handleChange}
              disabled
            />

            <TextField
              label="Basic Salary (PKR)"
              name="basicSalary"
              fullWidth
              value={form.basicSalary}
              onChange={handleChange}
              disabled
            />

            <TextField
              label="Bonus (PKR)"
              name="bonus"
              fullWidth
              value={form.bonus}
              onChange={handleChange}
            />

            <TextField
              label="Advance (PKR)"
              name="advance"
              fullWidth
              value={form.advance}
              onChange={handleChange}
            />

            <TextField
              label="Deductions (PKR)"
              name="deductions"
              fullWidth
              value={form.deductions}
              onChange={handleChange}
            />

            {/* Live Net Salary */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Net Salary:
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold" color="green">
                {new Intl.NumberFormat("en-PK", {
                  style: "currency",
                  currency: "PKR",
                  maximumFractionDigits: 0,
                }).format(calculateNetSalary())}
              </Typography>
            </Box>
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
