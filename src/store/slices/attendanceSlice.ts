import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAttendance,
  markAttendance,
  getEmployeeHistory,
} from "@/services/attendanceService";

// Define types for clarity
interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: string;
}

interface AttendanceState {
  list: AttendanceRecord[];
  history: AttendanceRecord[];
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: AttendanceState = {
  list: [],
  history: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchAttendance = createAsyncThunk(
  "attendance/fetchAll",
  async () => {
    const response = await getAttendance();
    return response;
  }
);

export const markEmployeeAttendance = createAsyncThunk(
  "attendance/mark",
  async (
    { employeeId, status }: { employeeId: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await markAttendance(employeeId, status);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to mark attendance");
    }
  }
);

export const fetchEmployeeHistory = createAsyncThunk(
  "attendance/fetchHistory",
  async (employeeId: string, { rejectWithValue }) => {
    try {
      const response = await getEmployeeHistory(employeeId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to load history");
    }
  }
);

// Slice
const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all attendance
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAttendance.fulfilled,
        (state, action: PayloadAction<AttendanceRecord[]>) => {
          state.loading = false;
          state.list = action.payload;
        }
      )
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error loading attendance";
      })

      // Mark attendance
      .addCase(
        markEmployeeAttendance.fulfilled,
        (state, action: PayloadAction<AttendanceRecord>) => {
          state.list.unshift(action.payload);
        }
      )
      .addCase(markEmployeeAttendance.rejected, (state, action) => {
        state.error = action.error.message || "Failed to mark attendance";
      })

      // Fetch employee history
      .addCase(
        fetchEmployeeHistory.fulfilled,
        (state, action: PayloadAction<AttendanceRecord[]>) => {
          state.history = action.payload;
        }
      )
      .addCase(fetchEmployeeHistory.rejected, (state, action) => {
        state.error = action.error.message || "Failed to load history";
      });
  },
});

export default attendanceSlice.reducer;
