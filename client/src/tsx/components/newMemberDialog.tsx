import { Dispatch, Ref, SetStateAction, forwardRef, useRef, useState } from "react";
import Dialog from "./dialog";
import Input from "./input";
import Button from "./button";

export default function NewMemberDialog(props:{addMember:Function,showSate:[boolean, Dispatch<SetStateAction<boolean>>]}){
    const dialogRef = useRef(null) as any

    let [name,setName] = useState("")
    let [email,setEmail] = useState("")
    let [password,setPassword] = useState("")

    function generatePassword(){
        setPassword(Math.random().toString(32).slice(2))
    }
    
    function resetData(){
        setName("")
        setEmail("")
        setPassword("")
    }

    function close(){
        props.addMember(name,email,password)
        dialogRef.current.close()
    }
    
    return (
        <Dialog onClose={resetData} showSate={props.showSate} ref={dialogRef}>
            <h1>משתתף חדש</h1>
            <Input value={name} setFunc={setName} placeholder="שם"/>
            <Input value={email} setFunc={setEmail} placeholder="איימל" lrt/>
            <div className="pr">
                <span onClick={generatePassword} className="dialog__icon material-symbols-outlined">auto_fix</span>
                <Input lrt value={password} setFunc={setPassword} placeholder="סיסמה"/>
            </div>
            <Button onClick={close} text="הוסף" color={1}/>
        </Dialog>
    )
}
