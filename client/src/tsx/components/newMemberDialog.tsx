import { Dispatch, SetStateAction, useRef, useState } from "react";
import Dialog from "./general/dialog";
import Input from "./general/input";
import Button from "./general/button";
import Feedback from "./general/feedback";

export default function NewMemberDialog(props:{addMember:Function,showSate:[boolean, Dispatch<SetStateAction<boolean>>]}){
    const dialogRef = useRef(null) as any

    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [feedback,setFeedback] = useState("")

    function generatePassword(){
        setPassword(Math.random().toString(32).slice(2))
    }
    
    function resetData(){
        setName("")
        setEmail("")
        setPassword("")
        setFeedback("")
    }

    function submit(){
        if(!name || !email || !password){
            setFeedback('נא למלא את כל הפרטים')
            return
        }
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
            <Feedback show={!!feedback} text={feedback}/>
            <Button onClick={submit} text="הוסף" color={1}/>
        </Dialog>
    )
}
