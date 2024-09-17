import { createSlice } from '@reduxjs/toolkit'

export const crudSlice = createSlice({
  name: 'crud',
  initialState: {
    parentElement: {
      endPoint: null,
      data: null
    },
    formElement: {
      endPoint: null,
      data: null
    },
    filterQuery: {
      endPoint: null,
      query: null
    },
    tableEndpoint: null,
    tableFilter: null
  },
  reducers: {
    setParentElement: (state, action) => {
      state.parentElement = action.payload
    },
    showFormElement: (state, action) => {
      state.formElement = action.payload
    },
    refreshTable: (state, action) => {
      state.tableEndpoint = action.payload
    },
    showFilter: (state, action) => {
      state.tableFilter = action.payload
    },
    hideFilter: (state) => {
      state.tableFilter = null
    },
    setFilterQuery: (state, action) => {
      state.filterQuery = action.payload
    },
    removeFilterQuery: (state) => {
      state.filterQuery = {
        endPoint: null,
        query: null
      }
    }
  }
})

export const {
  showFormElement,
  refreshTable,
  setParentElement,
  showFilter,
  hideFilter,
  setFilterQuery,
  removeFilterQuery
} = crudSlice.actions

export default crudSlice.reducer
