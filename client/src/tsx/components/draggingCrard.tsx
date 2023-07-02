import { CSSProperties, Ref, forwardRef, useImperativeHandle, useState } from "react"


const Dialog = forwardRef((_,ref:Ref<any>) => {
    const [name,setName] = useState("none")
    const [style,setStyle] = useState<CSSProperties>({})

    function update(name:string,top:number,left:number){
        const memberRef = document.querySelector('.quizForm__member--notdragging')
        // console.log(memberRef)
        setName(name)
        setStyle({
            display:'block',
            top:`${top}px`,
            left:`${left}px`,
            width:`${memberRef?.clientWidth}px`
        })
    }

    function stop(){
        setStyle({display:'none'})
    }


    //addes close function to refrence to be used in parent
    useImperativeHandle(ref, () => ({update,stop}));

    return <div style={style} className="quizForm__member quizForm__member--dragging" ref={ref}>{name}</div>
})

export default Dialog