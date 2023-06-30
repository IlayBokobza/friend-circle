import Cookie from 'js-cookie';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux'
import {setAll} from './store/userSlice'
import store from './store/store'
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import axios from 'axios';
import GuardedRoute from './tsx/components/guardedRoute';

//views
import Login from './tsx/views/login';
import Signup from './tsx/views/signup';
import P404 from './tsx/views/404';
import Home from './tsx/views/home';
import Create from './tsx/views/create';

async function main(){
  //auto sign in
  const token = Cookie.get('token')
  if(token){
    try {
      const res = await axios.get('/api/user')
      store.dispatch(setAll({...res.data,token}))
    } catch (error) {
      console.warn(error)
    }
  }

  const router = createBrowserRouter([
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
  
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  

  root.render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

main()