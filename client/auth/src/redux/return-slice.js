import { createSlice } from '@reduxjs/toolkit'

export const returnSlice = createSlice({
  name: 'return',
  initialState: {
    saleId: null,
    returnProducts: []
  },
  reducers: {
    showReturn: (state, action) => {
      state.saleId = action.payload
    },
    removeReturn: (state) => {
      state.saleId = null
    },
    addProduct: (state, action) => {
      if (action.payload.quantity === 0) {
        state.returnProducts = state.returnProducts.filter(product => product.id !== action.payload.id)
        return
      }

      const product = state.returnProducts.some(product => product.id === action.payload.id)

      if (!product) {
        state.returnProducts.push(action.payload)
      } else {
        state.returnProducts = state.returnProducts.map(product => {
          if (product.id === action.payload.id) {
            product.quantity = action.payload.quantity
          }
          return product
        })
      }
    }
  }
})

export const { addProduct, showReturn, removeReturn } = returnSlice.actions

export default returnSlice.reducer
