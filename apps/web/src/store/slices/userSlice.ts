import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User, Address } from '@/types'

interface UserState {
  profile: User | null
  wishlist: string[]
  addresses: Address[]
}

const initialState: UserState = {
  profile: null,
  wishlist: [],
  addresses: [],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User | null>) => {
      state.profile = action.payload
    },
    toggleWishlist: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const idx = state.wishlist.indexOf(id)
      if (idx >= 0) state.wishlist.splice(idx, 1)
      else state.wishlist.push(id)
    },
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.wishlist = action.payload
    },
    setAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      state.addresses.push(action.payload)
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter((a) => a.id !== action.payload)
    },
  },
})

export const { setProfile, toggleWishlist, setWishlist, setAddresses, addAddress, removeAddress } = userSlice.actions
export default userSlice.reducer
