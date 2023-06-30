import { Link } from "react-router-dom"

export default function InnerPage(props:{children?:React.ReactNode,title?:string}){
    let title = 'מעגל החברים'
    if(props.title){
        title = props.title
    }

    return <div className="innerpage">
        <Link to="/" className="innerpage__title">{title}</Link>
        <div className="innerpage__container">
            {props.children}
        </div>
    </div>
}