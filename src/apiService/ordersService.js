import { createAsyncThunk } from '@reduxjs/toolkit';
import { callApi } from './apiUtils';

export const createOrder = createAsyncThunk('createOrder', async (data, { rejectWithValue }) => {
  try {
    const response = await callApi('post', 'v1/orders', null, data);
    return response;
  } catch (error) {
    return rejectWithValue({ ...error });
  }
});