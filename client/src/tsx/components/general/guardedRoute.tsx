import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'

export default function GuardedRoute(props:{loggedIn:boolean,children:React.ReactNode}){
    const naviagte = useNavigate()
    const id = useSelector((state:any) => state.user.id)

    useEffect(() => {
        if(props.loggedIn && !id){
            naviagte('/login',{replace:true})
        }
        else if(!props.loggedIn && id){
            naviagte('/',{replace:true})
        }
    },[id])

    if((props.loggedIn && id) || (!props.loggedIn && !id)){
        return <div>{props.children}</div>
    }

    return <div></div>
}