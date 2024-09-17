import { createSlice } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    assistant: null,
    threadId: null,
    prompt: null,
    responseState: false,
  },
  reducers: {
    setAssistant: (state, action) => {
      state.assistant = action.payload
    },
    setThread: (state, action) => {
      state.threadId = action.payload
    },
    newPrompt: (state, action) => {
      state.prompt = action.payload
    },
    setResponseState: (state, action) => {
      state.responseState = action.payload
    }
  }
})

export const { setAssistant, newPrompt, setResponseState, setThread } = chatSlice.actions

export default chatSlice.reducer
