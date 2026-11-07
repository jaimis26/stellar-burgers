import { getOrderByNumberApi, orderBurgerApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@/utils/types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderByNumber: TOrder | null;
  orderByNumberLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orderByNumber: null,
  orderByNumberLoading: false,
  error: null,
};

export const createOrderThunk = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);
    return data.order;
  }
);

export const fetchOrderByNumberThunk = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
    },
    clearOrderByNumber: (state) => {
      state.orderByNumber = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Не удалось получить заказ';
      })
      .addCase(fetchOrderByNumberThunk.pending, (state) => {
        state.orderByNumberLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumberThunk.fulfilled, (state, action) => {
        state.orderByNumberLoading = false;
        state.orderByNumber = action.payload;
      })
      .addCase(fetchOrderByNumberThunk.rejected, (state, action) => {
        state.orderByNumberLoading = false;
        state.error = action.error.message ?? 'Не удалось получить заказ';
      });
  },
});

export const { clearOrder, clearOrderByNumber } = orderSlice.actions;
export default orderSlice.reducer;
