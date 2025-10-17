"use client";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import { History } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchAttendance,
  markEmployeeAttendance,
  fetchEmployeeHistory,
} from "@/store/slices/attendanceSlice";
import { fetchEmployees } from "@/store/slices/employeeSlice";

export default function AttendancePage() {
  const dispatch = useDispatch<AppDispatch>();

  const { list: employees, loading: empLoading } = useSelector(
    (state: RootState) => state.employees
  );
  const { list: attendanceList, history, loading } = useSelector(
    (state: RootState) => state.attendance
  );

  const [openHistory, setOpenHistory] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [localCheckedIn, setLocalCheckedIn] = useState<string[]>([]);

  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  // ✅ Restore checked-in list and reset if a new day starts
  useEffect(() => {
    const savedChecked = JSON.parse(localStorage.getItem("checkedIn") || "[]");
    const savedDate = localStorage.getItem("attendanceDate");

    if (savedDate === today) {
      setLocalCheckedIn(savedChecked);
    } else {
      localStorage.setItem("checkedIn", JSON.stringify([]));
      localStorage.setItem("attendanceDate", today);
      setLocalCheckedIn([]);
    }
  }, [today]);

  // ✅ Load employee and attendance data
  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchAttendance());
  }, [dispatch]);

  // ✅ Handle check-in
  const handleCheckIn = async (empId: string) => {
    // update local state + storage
    const updated = [...localCheckedIn, empId];
    setLocalCheckedIn(updated);
    localStorage.setItem("checkedIn", JSON.stringify(updated));

    await dispatch(markEmployeeAttendance({ employeeId: empId, status: "Present" }));
    dispatch(fetchAttendance());
  };

  // ✅ Handle view history
  const handleViewHistory = async (empId: string) => {
    setSelectedEmp(employees.find((e) => e._id === empId));
    await dispatch(fetchEmployeeHistory(empId));
    setOpenHistory(true);
  };

  if (empLoading || loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight="bold">
          Employee Attendance
        </Typography>
        <Typography color="text.secondary" fontWeight="500">
          {new Date().toDateString()}
        </Typography>
      </Box>

      {/* Table */}
      <Paper sx={{ borderRadius: 3, boxShadow: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Employee Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Designation</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => {
                // ✅ Check if already marked today
                const alreadyMarked = attendanceList.some(
                  (a: any) =>
                    a.employeeId?._id === emp._id &&
                    a.date?.startsWith(today) // check only date part
                );

                const isDisabled = alreadyMarked || localCheckedIn.includes(emp._id);

                return (
                  <TableRow key={emp._id}>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.designation}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                        <Button
                          variant="contained"
                          color="success"
                          disabled={isDisabled}
                          onClick={() => handleCheckIn(emp._id)}
                          sx={{
                            borderRadius: 3,
                            textTransform: "none",
                            px: 3,
                            py: 0.8,
                            fontWeight: "bold",
                            opacity: isDisabled ? 0.6 : 1,
                          }}
                        >
                          {isDisabled ? "Checked In" : "Check In"}
                        </Button>

                        <Tooltip title="View Attendance History">
                          <IconButton color="primary" onClick={() => handleViewHistory(emp._id)}>
                            <History />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* History Dialog */}
      <Dialog open={openHistory} onClose={() => setOpenHistory(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {selectedEmp?.name}'s Attendance History
        </DialogTitle>
        <DialogContent dividers>
          {history.length ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((record: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>
                      {/* ✅ If backend stores `time`, show it; else format `createdAt` */}
                      {record.time
                        ? record.time
                        : new Date(record.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: record.status === "Present" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {record.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography>No history found</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
