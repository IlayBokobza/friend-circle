import { MouseEventHandler } from "react"
import { Link } from "react-router-dom"

export default function Button(props:{text:string,color:number,round?:boolean,linkTo?:string,onClick?:MouseEventHandler<HTMLButtonElement>}){

    
    function getClassName(){
        let className = `btn btn--color-${props.color}`

        if(props.round){
            className += ' btn--round'
        }

        return className
    }

    if(props.linkTo){
        return <Link to={props.linkTo} className={getClassName()}><span className="btn__text">{props.text}</span></Link>
    }
    else{
        return <button onClick={props.onClick} className={getClassName()}><span className="btn__text">{props.text}</span></button>
    }

}