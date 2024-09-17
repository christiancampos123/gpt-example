import { createSlice } from '@reduxjs/toolkit'

export const saleSlice = createSlice({
  name: 'sale',
  initialState: {
    saleId: null
  },
  reducers: {
    showSale: (state, action) => {
      state.saleId = action.payload.id
    },
    removeSale: (state) => {
      state.saleId = null
    }
  }
})

export const { showSale, removeSale } = saleSlice.actions

export default saleSlice.reducer
