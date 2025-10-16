import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "@/services/employeeService";

export const fetchEmployees = createAsyncThunk("employees/fetchAll", async () => {
  return await getEmployees();
});

export const addEmployee = createAsyncThunk("employees/add", async (employee) => {
  return await createEmployee(employee);
});

export const editEmployee = createAsyncThunk("employees/edit", async ({ id, data }) => {
  return await updateEmployee(id, data);
});

export const removeEmployee = createAsyncThunk("employees/remove", async (id) => {
  await deleteEmployee(id);
  return id;
});

const employeeSlice = createSlice({
  name: "employees",
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editEmployee.fulfilled, (state, action) => {
        const index = state.list.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(removeEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => e._id !== action.payload);
      });
  },
});

export default employeeSlice.reducer;
