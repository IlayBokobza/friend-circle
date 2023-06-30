import { HTMLInputTypeAttribute } from "react";

export default function Input(props:{lrt?:boolean,value:string,placeholder?:string,type?:HTMLInputTypeAttribute,setFunc?:React.Dispatch<React.SetStateAction<string>>}){
    
    function handleChange(e:React.ChangeEvent<HTMLInputElement>){
        if(props.setFunc){
            props.setFunc(e.target.value)
        }
    }

    function getClassName(){
        let className = 'input'

        if(props.lrt){
            className += ' input--ltr'
        }

        return className
    }

    return <input value={props.value} onChange={(e) => {handleChange(e)}} className={getClassName()} type={props.type || "text"} placeholder={props.placeholder}/>
}