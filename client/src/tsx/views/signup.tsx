import Input from "../components/general/input"
import Button from "../components/general/button"
import { Link } from "react-router-dom"
import { useState } from "react"
import Feedback from "../components/general/feedback"
import axios from "axios"
import Cookie from 'js-cookie'

export default function Signup(){
    //form
    const [email,setEmail] = useState("")
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [password2,setPassword2] = useState("")

    //extra
    const [feedback,setFeedback] = useState("")

    async function handleClick(){
        //validate form
        if(!email || !name || !password || !password2){
            setFeedback('נא למלא את כל הפרטים')
            return
        }

        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
            setFeedback('איימל לא תקין')
            return
        }

        if(password !== password2){
            setFeedback('סיסמאות לא זהות')
            return
        }

        setFeedback("")

        //signup
        try {
            const res = await axios.post('/api/user',{email,password,name})
            Cookie.set('token',res.data.token)
            window.location.reload()
        } catch (error:any) {
            if(error.response.data){
                setFeedback(error.response.data)
            }
            else{
                console.warn(error)
            }
        }
    }

    return (
        <div className="login">
            <div className="login__title"><h1>מעגל <br/> החברים</h1></div>
            <div className="login__side">
                <h2>הרשמה</h2>
                <Input value={email} lrt setFunc={setEmail} placeholder="איימל"></Input>
                <Input value={name} setFunc={setName} placeholder="שם"></Input>
                <Input value={password} setFunc={setPassword} placeholder="סיסמה" type="password"></Input>
                <Input value={password2} setFunc={setPassword2} placeholder="סיסמה שוב" type="password"></Input>
                <Feedback show={!!feedback} text={feedback}></Feedback>
                <Button onClick={handleClick} text="התחברות" color={1}></Button>
                <Link className="login__side__switch-page" to={"/login"}>?יש לך כבר משתמש</Link>
            </div>
        </div>
    )
}