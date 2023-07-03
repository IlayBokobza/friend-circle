import { useCallback, useEffect, useRef, useState } from "react";
import {useDrop} from 'react-dnd'
import { Member, MemberMinimal, QuizMinimal } from "../../store/quizSlice"
import QuizLogin from "../components/quizLogin";
import InnerPage from "../components/innerPage";
import { Tooltip } from 'react-tooltip'
import MemberCard from "../components/memberCard";
import Button from "../components/general/button";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function QuizForm(){
    const [me,setMe] = useState({} as Member)
    const [quiz,setQuiz] = useState({} as QuizMinimal)
    const {id} = useParams()

    //cols
    const col1 = useRef<HTMLDivElement>(null)
    const col2 = useRef<HTMLDivElement>(null)
    const col3 = useRef<HTMLDivElement>(null)
    const col4 = useRef<HTMLDivElement>(null)

    //lists
    const [naturals,setNaturals] = useState([] as MemberMinimal[])
    const [friends,setFriends] = useState([] as MemberMinimal[])
    const [goodFriends,setGoodFriends] = useState([] as MemberMinimal[])
    const [closeFriends,setCloseFriends] = useState([] as MemberMinimal[])

    function deleteFromLists(id:string){
        setNaturals(n => n.filter(m => m.id != id))
        setFriends(n => n.filter(m => m.id != id))
        setGoodFriends(n => n.filter(m => m.id != id))
        setCloseFriends(n => n.filter(m => m.id != id))
    }

    const [_0,naturalsDrop] = useDrop(() => ({
        accept:"member",
        drop:(m:MemberMinimal) => {
            deleteFromLists(m.id)
            setNaturals(c => [...c,m])
        }
    }))
    
    const [_1,friendsDrop] = useDrop(() => ({
        accept:"member",
        drop:(m:MemberMinimal) => {
            deleteFromLists(m.id)
            setFriends(c => [...c,m])
        }
    }))

    const [_2,goodFriendsDrop] = useDrop(() => ({
        accept:"member",
        drop:(m:MemberMinimal) => {
            deleteFromLists(m.id)
            setGoodFriends(c => [...c,m])
        }
    }))

    const [_3,closeFriendsDrop] = useDrop(() => ({
        accept:"member",
        drop:(m:MemberMinimal) => {
            deleteFromLists(m.id)
            setCloseFriends(c => [...c,m])
        }
    }))

    useEffect(() => {
        setNaturals(quiz.members?.filter((m:MemberMinimal) => m.id !== me.id))
        setFriends([])
        setGoodFriends([])
        setCloseFriends([])
    },[quiz,me])

    useEffect(() => {
        setFriends([])
    },[])

    async function submit(){
        const data = {
            ...me,
            response:{
                naturals:naturals.map((m) => m.id),
                friends:friends.map((m) => m.id),
                goodFriends:goodFriends.map((m) => m.id),
                closeFriends:closeFriends.map((m) => m.id)
            }
        }

        try{
            await axios.patch(`/api/quizes/minimal?id=${id}`,data)
            window.location.replace(`${window.location.origin}/quiz/${id}`)
        }
        catch(e){
            console.warn(e)
        }
    }

    if(!me.name){
        return <QuizLogin onGetData={setQuiz} onLoggedIn={setMe} />
    }

    

    return <InnerPage className="quizForm" disableLink title={`שלום, ${me.name}`}>
            <div ref={col1} className="quizForm__col">
                <Tooltip anchorSelect="#help__natural">מישהו שאין לך שום קשר איתו</Tooltip>
                <span id="help__natural" className="quizForm__help material-symbols-outlined">help</span>
                <div className="quizForm__title">פסיבי</div>
                <div ref={naturalsDrop} className="quizForm__col__container">
                    {naturals?.map((m:MemberMinimal) => (
                        <MemberCard col={col1} id={m.id} name={m.name} key={m.id}/>
                    ))}
                </div>
            </div>
            <div ref={col2} className="quizForm__col">
                <Tooltip anchorSelect="#help__friend">מישהו שיש לך קצת קשר איתו.</Tooltip>
                <span id="help__friend" className="quizForm__help material-symbols-outlined">help</span>
                <div className="quizForm__title">ידיד</div>
                <div ref={friendsDrop} className="quizForm__col__container">
                    {friends?.map((m:MemberMinimal) => (
                        <MemberCard col={col2} id={m.id} name={m.name} key={m.id}/>
                    ))}
                </div>
            </div>
            <div ref={col3} className="quizForm__col">
                <Tooltip anchorSelect="#help__goodFriend">מישהו שיש לך קשר טוב איתו, ולפעמים אתם עושים פעילות ביחד</Tooltip>
                <span id="help__goodFriend" className="quizForm__help material-symbols-outlined">help</span>
                <div className="quizForm__title">חבר</div>
                <div ref={goodFriendsDrop} className="quizForm__col__container">
                    {goodFriends?.map((m:MemberMinimal) => (
                        <MemberCard col={col3} id={m.id} name={m.name} key={m.id}/>
                    ))}
                </div>
            </div>
            <div ref={col4} className="quizForm__col">
                <Tooltip anchorSelect="#help__closeFriend">הוא בין החברים הכי טובים שלך. אתם מדברים על בסיס קבוע</Tooltip>
                <span id="help__closeFriend" className="quizForm__help material-symbols-outlined">help</span>
                <div className="quizForm__title">חבר קרוב</div>
                <div ref={closeFriendsDrop} className="quizForm__col__container">
                    {closeFriends?.map((m:MemberMinimal) => (
                        <MemberCard col={col4} id={m.id} name={m.name} key={m.id}/>
                    ))}
                </div>
            </div>
            <Button onClick={submit} className="quizForm__sendbtn" text="סיימתי" color={3}/>
        </InnerPage>
}