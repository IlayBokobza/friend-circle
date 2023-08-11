import { createSlice } from '@reduxjs/toolkit'

//full quiz type
export type Quiz = {
  title:string;
  id:string;
  members:Member[];
  open:boolean,
}

//quiz when requested by a member
export type QuizMinimal = {
  title:string;
  id:string;
  members:MemberMinimal[];
}

//full member type
export type Member = {
  name:string;
  email:string;
  password:string;
  response:Response;
  id:string;
}

//member when requeseted by another member
export type MemberMinimal = {
  name:string;
  id:string,
}

//Response type
export type Response = {
  natrual:string[];
  friend:string[];
  goodFriend:string[];
  closeFriend:string[];
}

export const quizesSlice = createSlice({
  name: 'quizes',
  initialState: {
    owned:[] as Member[]
  },
  reducers: {
    setQuizes:(state,action) => {
      state.owned = action.payload
    },
    updateQuiz:(state:any,action) => {
      const index = state.owned.findIndex((p:Quiz) => p.id == action.payload.id)
      state.owned[index] = action.payload
    },
    addQuiz:(state,action) => {
      state.owned.push(action.payload)
    }
  },
})

export const { setQuizes,updateQuiz,addQuiz } = quizesSlice.actions

export default quizesSlice.reducer