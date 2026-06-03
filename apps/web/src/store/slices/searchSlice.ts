import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '@/types'

interface SearchState {
  query: string
  results: Product[]
  isLoading: boolean
  error: string | null
}

const initialState: SearchState = {
  query: '',
  results: [],
  isLoading: false,
  error: null,
}

export const searchProducts = createAsyncThunk(
  'search/searchProducts',
  async (query: string) => {
    if (!query.trim()) return []
    const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`)
    const data = await res.json()
    return (data.items || []) as Product[]
  }
)

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => { state.query = action.payload },
    clearSearch: (state) => { state.query = ''; state.results = [] },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.results = action.payload
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Search failed'
      })
  },
})

export const { setQuery, clearSearch } = searchSlice.actions
export default searchSlice.reducer
