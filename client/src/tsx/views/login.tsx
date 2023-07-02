import Input from "../components/input"
import Button from "../components/button"
import { Link } from "react-router-dom"
import { useState } from "react"
import Feedback from "../components/feedback"
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setAll } from '../../store/userSlice'
import Cookie from 'js-cookie'

export default function Login(){
    //state
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [feedback,setFeedback] = useState("")

    //redux
    const dispatch = useDispatch()

    async function handleClick(){
        //check email
        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
            setFeedback('איימל לא תקין')
            return
        }

        //check password
        if(!password){
            setFeedback('נא למלא את כל הפרטים')
            return
        }

        setFeedback("")

        try {
            const res = await axios.post('/api/user/login',{email,password})
            Cookie.set('token',res.data.token)
            dispatch(setAll(res.data))
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
                <h2>התחברות</h2>
                <Input value={email} lrt setFunc={setEmail} placeholder="איימל"></Input>
                <Input value={password} setFunc={setPassword} placeholder="סיסמה" type="password"></Input>
                <Feedback show={!!feedback} text={feedback}></Feedback>
                <Button onClick={handleClick} text="התחבר" color={1}></Button>
                <Link className="login__side__switch-page" to={"/signup"}>משתמש חדש</Link>
            </div>
        </div>
    )
}