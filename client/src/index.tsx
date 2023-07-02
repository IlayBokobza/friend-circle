import axios from 'axios';
import Cookie from 'js-cookie';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import {RouterProvider} from "react-router-dom";
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

import router from './router'
import store from './store/store'
import { setQuizes } from './store/quizSlice';
import {setAll} from './store/userSlice'
import './index.css';
import React from 'react';

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
    <React.StrictMode>
      <DndProvider backend={HTML5Backend}>
          <Provider store={store}>
            <RouterProvider router={router} />
          </Provider>
      </DndProvider>
    </React.StrictMode>
  );
}

main()