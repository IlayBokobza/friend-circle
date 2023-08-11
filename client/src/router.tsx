import { createBrowserRouter } from "react-router-dom";
import GuardedRoute from './tsx/components/general/guardedRoute';

import Login from './tsx/views/login';
import Signup from './tsx/views/signup';
import P404 from './tsx/views/404';
import Home from './tsx/views/home';
import Create from './tsx/views/create';
import QuizForm from "./tsx/views/quizForm";

export default createBrowserRouter([
    {
      path: "/login",
      element: 
      <GuardedRoute loggedIn={false}>
        <Login/>
      </GuardedRoute>,
    },
    {
      path: "/signup",
      element: 
      <GuardedRoute loggedIn={false}>
        <Signup/>
      </GuardedRoute>,
    },
    {
      path:'/',
      element:
      <GuardedRoute loggedIn>
        <Home/>
      </GuardedRoute>
    },
    {
      path:'/create',
      element:
      <GuardedRoute loggedIn>
        <Create/>
      </GuardedRoute>
    },
    {
      path:'/quiz/:id',
      element:<QuizForm/>
    },
    {
      path: "*",
      element: <P404/>
    },
  ])