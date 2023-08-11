import { Link } from "react-router-dom"
import If from "./general/if"

export default function InnerPage(props:{children?:React.ReactNode,title?:string,className?:string,disableLink?:boolean}){
    const title = (props.title) ? props.title : 'מעגל החברים'
    const className = (props.className) ? `innerpage__container ${props.className}` : 'innerpage__container'

    return <div className="innerpage">
        <If condition={!props.disableLink}>
            <Link to="/" className="innerpage__title">{title}</Link>
        </If>
        <If condition={props.disableLink!}>
            <h1 className="innerpage__title">{title}</h1>
        </If>
        <div className={className}>
            {props.children}
        </div>
    </div>
}