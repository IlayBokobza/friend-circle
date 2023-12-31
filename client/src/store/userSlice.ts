import { createSlice } from '@reduxjs/toolkit'

export type User = {
  name:string,
  email:string,
  id:string,
  token:string
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    name:"",
    email:"",
    id:"",
    token:"",
  },
  reducers: {
    setAll:(state,action) => {
        state.email = action.payload.email
        state.id = action.payload.id
        state.token = action.payload.token
        state.name = action.payload.name
    }
  },
})

export const { setAll } = userSlice.actions

export default userSlice.reducer