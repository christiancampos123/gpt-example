import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartProducts: []
  },
  reducers: {
    addProduct: (state, action) => {
      if (action.payload.quantity === 0) {
        state.cartProducts = state.cartProducts.filter(product => product.id !== action.payload.id)
        return
      }

      const product = state.cartProducts.some(product => product.id === action.payload.id)

      if (!product) {
        state.cartProducts.push(action.payload)
      } else {
        state.cartProducts = state.cartProducts.map(product => {
          if (product.id === action.payload.id) {
            product.quantity = action.payload.quantity
          }
          return product
        })
      }
    },
    removeCart: (state, action) => {
      state.cartProducts = []
    }
  }
})

export const { addProduct, removeCart } = cartSlice.actions

export default cartSlice.reducer
