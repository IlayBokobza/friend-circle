import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Button from "./general/button";
import Input from "./general/input";
import { useEffect, useState } from "react";
import axios from "axios";
import Feedback from "./general/feedback";

export default function QuizLogin(props:{onLoggedIn:Function,onGetData:Function}){
    const {id} = useParams()
    const navigate = useNavigate()
    
    const [title,setTitle] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [feedback,setFeedback] = useState("")
    const [searchParams] = useSearchParams();
    const emailQuery = searchParams.get('email')
    const passwordQuery = searchParams.get('password')



    useEffect(() => {
        (async () => {
            try{
                const res = await axios.get(`/api/quizes/minimal?id=${id}`)
                setTitle(res.data.title)
                props.onGetData(res.data)
            }catch{
                navigate('/404')
            }
        })()

        if(emailQuery && passwordQuery){
            setEmail(emailQuery)
            setPassword(passwordQuery)
        }
    },[])


    async function handleClick() {
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
            const res = await axios.post(`/api/quizes/minimal?id=${id}`,{email,password})
            props.onLoggedIn(res.data)
        } catch (error:any) {
            if(error.response.data){
                setFeedback(error.response.data)
            }
            else{
                console.warn(error)
            }
        }
    }

    return <div className="login">
        <div className="login__title"><h1>{title}</h1></div>
        <div className="login__side">
            <h2>התחברות לשאלון</h2>
            <Input value={email} lrt setFunc={setEmail} placeholder="איימל"></Input>
            <Input value={password} setFunc={setPassword} placeholder="סיסמה" type="password"></Input>
            <Feedback show={!!feedback} text={feedback}/>
            <Button onClick={handleClick} text="התחבר" color={1}></Button>
        </div>
    </div>
}