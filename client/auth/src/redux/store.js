import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cart-slice'
import saleReducer from './sale-slice'
import returnReducer from './return-slice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    sale: saleReducer,
    return: returnReducer
  }
})

export default store
