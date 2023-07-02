import React from "react";

export default function If(props:{condition:boolean,children:React.ReactNode}){
    if(props.condition){
        return <div>{props.children}</div>
    }
    return <></>
}