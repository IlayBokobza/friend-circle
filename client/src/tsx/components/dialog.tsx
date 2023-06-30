import React, { Dispatch, MutableRefObject, Ref, SetStateAction, forwardRef, useImperativeHandle, useState } from "react";

const Dialog = forwardRef((props:{children?:React.ReactNode,onClose?:Function,showSate:[boolean, Dispatch<SetStateAction<boolean>>]},ref:Ref<any>) => {
    const [show,setShow] = props.showSate
    const [className,setClassName] = useState("dialog")

    function close(){
        setClassName('dialog dialog--out')

        setTimeout(() => {
            if(props.onClose){
                props.onClose()
            }
            setShow(false)
            setClassName('dialog')

        },100)
    } 

    //addes close function to refrence to be used in parent
    useImperativeHandle(ref, () => ({close}));
 

    if(show){
        return (
            <div onClick={() => close()} className={className}>
                <div onClick={(e) => e.stopPropagation()} className="dialog__container">
                    {props.children}
                </div>
            </div>
        )
    }
    else{
        return <div></div>
    }
})

export default Dialog