import Button from "../components/general/button";
import InnerPage from "../components/innerPage";
import Input from "../components/general/input";
import {useState} from 'react'
import MembersTable from "../components/membersTable";
import If from "../components/general/if";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom"
import NewMemberDialog from "../components/newMemberDialog";
import { Member, NewMember, NewQuiz, Quiz, addQuiz, updateQuiz } from "../../store/quizSlice";
import { useDispatch, useSelector } from "react-redux";

let membersRaw:Member[] = []
export default function Create(){
    const showState = useState(false)
    const [_,setShow] = showState
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    //load data if need to
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id")
    const quiz = useSelector((state:any) => (state.quizes.owned as Quiz[]).find((q:Quiz) => q.id == id))
    let membersSlim = quiz?.members.map((m:Member):NewMember => {
        const newM:any = {...m}
        delete newM.response
        return newM
    }) || []

    //set state
    const [title,setTitle] = useState(quiz?.title || "")
    const [members,setMembers] = useState((membersSlim) ? [...membersSlim] : [] as NewMember[])
    if(!membersRaw.length){
        membersRaw = (quiz) ? [...quiz.members] : []
    }
    
    function addMember(name:string,email:string,password:string){
        const m = {name,email,password,id:"",response:{
            natrual:[],
            friend:[],
            goodFriend:[],
            closeFriend:[]
        }}
        membersRaw = [...membersRaw,m]
        setMembers([...members,{name,email,password}])
    }

    async function create(data:NewQuiz){
        try{
            const res = await axios.post('/api/quizes',data)
            dispatch(addQuiz({id:res.data,...data}))
            navigate(`/create?id=${res.data}`)
        }
        catch(e){
            console.warn(e)
        }
    }

    async function update(data:NewQuiz){
        try{
            await axios.patch(`/api/quizes?id=${id}`,data)
            dispatch(updateQuiz({...data,id}))
        }
        catch(e){
            console.warn(e)
        }
    }

    function save(){
        const data = {
            title,
            members:membersRaw,
        }

        if(!quiz){
            create(data)
        }
        else{
            update(data)
        }
    }

    function copyLink(){
        navigator.clipboard.writeText(`${window.location.origin}/quiz/${id}`)
    }

    return <InnerPage>
        <NewMemberDialog addMember={addMember} showSate={showState}/>
        <div className="create">
            <Input setFunc={setTitle} value={title} placeholder="שם השאלון"/>
            <div className="create__btns">
                <Button onClick={() => setShow(true)} text="הוספת משתתף " color={1}/>
                {/* <Button text="תוצאות" color={1}/> */}
                <If condition={!!id}>
                    <Button onClick={copyLink} text="העתק קישור" color={1}/>
                </If>
                <If condition={!!members.length && !!title}>
                    <Button onClick={save} text="שמירה" color={1}/>
                </If>
            </div>
            <MembersTable members={members} />
        </div>
    </InnerPage>
}