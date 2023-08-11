export default function Feedback(props:{text:string,show?:boolean}){
    function getClassName(){
        let className = 'feedback'

        if(!props.show){
            className += ' feedback--hide'
        }
        
        return className
    }

    return <p className={getClassName()}>{props.text}</p>
}