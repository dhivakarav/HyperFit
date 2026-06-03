import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './slices/uiSlice'
import userReducer from './slices/userSlice'
import searchReducer from './slices/searchSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    user: userReducer,
    search: searchReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
