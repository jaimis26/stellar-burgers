import { getFeedsApi, getOrdersApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder, TOrdersData } from '@/utils/types';

export type TSliceFeedState = TOrdersData & {
  userOrders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TSliceFeedState = {
  orders: [],
  userOrders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const fetchFeed = createAsyncThunk('feed/fetchFeed', async () => {
  const data = await getFeedsApi();
  return data;
});

export const fetchUserOrders = createAsyncThunk('feed/fetchUserOrders', async () => {
  const data = await getOrdersApi();
  return data;
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось получить ленту заказов';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      });
  },
});

export default feedSlice.reducer;
