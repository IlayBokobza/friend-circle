import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/button";
import Input from "../components/input";
import { useEffect, useState } from "react";
import axios from "axios";

export default function QuizLogin(){
    const {id} = useParams()
    const navigate = useNavigate()
    const [title,setTitle] = useState("")

    useEffect(() => {
        (async () => {
            try{
                const res = await axios.get(`/api/quizes/minimal?id=${id}`)
                setTitle(res.data)
            }catch{
                navigate('/404')
            }
        })()
    },[])


    return <div className="login">
        <div className="login__title"><h1>{title}</h1></div>
        <div className="login__side">
            <h2>התחברות לשאלון</h2>
            <Input placeholder="איימל" value={""}></Input>
            <Input  placeholder="סיסמה" type="password" value={""}></Input>
            {/* <Feedback show={!!feedback} text={feedback}></Feedback> */}
            <Button text="התחבר" color={1}></Button>
        </div>
    </div>
}