import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  theme: 'dark' | 'light'
  searchOpen: boolean
  mobileMenuOpen: boolean
  currency: string
}

const initialState: UiState = {
  theme: 'dark',
  searchOpen: false,
  mobileMenuOpen: false,
  currency: 'INR',
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload
    },
    toggleSearch: (state) => { state.searchOpen = !state.searchOpen },
    setSearchOpen: (state, action: PayloadAction<boolean>) => { state.searchOpen = action.payload },
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => { state.mobileMenuOpen = action.payload },
    setCurrency: (state, action: PayloadAction<string>) => { state.currency = action.payload },
  },
})

export const { setTheme, toggleSearch, setSearchOpen, toggleMobileMenu, setMobileMenuOpen, setCurrency } = uiSlice.actions
export default uiSlice.reducer
