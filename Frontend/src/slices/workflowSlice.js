import { createSlice } from '@reduxjs/toolkit';

export const workflowSlice = createSlice({
  name: 'workflow',
  initialState: {
    data: null,
    userId: null,
    resultData: null
  },
  reducers: {
    setWorkflowData: (state, action) => {
      state.data = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setResultData: (state, action) => {
      state.resultData = action.payload;
    }
  },
});

export const { setWorkflowData, setUserId, setResultData } = workflowSlice.actions;

export default workflowSlice.reducer;
