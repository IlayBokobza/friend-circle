import { Link } from "react-router-dom"

export default function InnerPage(props:{children?:React.ReactNode,title?:string,className?:string}){
    const title = (props.title) ? props.title : 'מעגל החברים'
    const className = (props.className) ? `innerpage__container ${props.className}` : 'innerpage__container'

    return <div className="innerpage">
        <Link to="/" className="innerpage__title">{title}</Link>
        <div className={className}>
            {props.children}
        </div>
    </div>
}