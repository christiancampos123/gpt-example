import { configureStore } from '@reduxjs/toolkit'
import imagesReducer from './images-slice'
import crudReducer from './crud-slice'

export const store = configureStore({
  reducer: {
    images: imagesReducer,
    crud: crudReducer
  }
})

export default store
