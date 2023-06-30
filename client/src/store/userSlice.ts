import { createSlice } from '@reduxjs/toolkit'

export type User = {
  name:string,
  email:string,
  id:string,
  token:string
}

export const counterSlice = createSlice({
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

export const { setAll } = counterSlice.actions

export default counterSlice.reducer