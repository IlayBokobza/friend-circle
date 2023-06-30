import { createBrowserRouter } from "react-router-dom";
import GuardedRoute from './tsx/components/guardedRoute';

import Login from './tsx/views/login';
import Signup from './tsx/views/signup';
import P404 from './tsx/views/404';
import Home from './tsx/views/home';
import Create from './tsx/views/create';

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
        <Home></Home>
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
      path: "*",
      element: <P404/>
    },
  ])