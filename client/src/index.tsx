import axios from 'axios';
import Cookie from 'js-cookie';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import {RouterProvider} from "react-router-dom";

import router from './router'
import store from './store/store'
import { setQuizes } from './store/quizSlice';
import {setAll} from './store/userSlice'
import './index.css';

async function main(){
  //auto sign in
  const token = Cookie.get('token')
  if(token){
    try {
      //get user data
      let res = await axios.get('/api/user')
      store.dispatch(setAll({...res.data,token}))

      //get quizes
      res = await axios.get('/api/quizes')
      store.dispatch(setQuizes(res.data || []))
    } catch (error) {
      console.warn(error)
    }
  }

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