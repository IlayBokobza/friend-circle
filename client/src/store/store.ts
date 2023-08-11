import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import quizesReducer from './quizSlice'

export default configureStore({
  reducer: {
    user:userReducer,
    quizes:quizesReducer,
  },
})