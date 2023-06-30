import Button from "../components/button";
import InnerPage from "../components/innerPage";
import Input from "../components/input";
import {useState} from 'react'
import MembersTable from "../components/membersTable";
import If from "../components/if";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom"
import NewMemberDialog from "../components/newMemberDialog";
import { Member, NewMember, NewQuiz, Quiz, addQuiz, updateQuiz } from "../../store/quizSlice";
import { useDispatch, useSelector } from "react-redux";

let membersRaw:Member[] = []
export default function Create(){
    const showState = useState(false)
    let [_,setShow] = showState
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    //load data if need to
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id")
    console.log(id)
    const quiz = useSelector((state:any) => (state.quizes.owned as Quiz[]).find((q:Quiz) => q.id == id))
    let membersSlim = quiz?.members.map((m:Member):NewMember => {
        const newM:any = {...m}
        delete newM.response
        return newM
    }) || []

    //set state
    let [title,setTitle] = useState(quiz?.title || "")
    let [members,setMembers] = useState((membersSlim) ? [...membersSlim] : [] as NewMember[])
    if(!membersRaw.length){
        membersRaw = (quiz) ? [...quiz.members] : []
    }
    
    function addMember(name:string,email:string,password:string){
        const m = {name,email,password,response:{
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

    return <InnerPage>
        <NewMemberDialog addMember={addMember} showSate={showState}/>
        <div className="create">
            <Input setFunc={setTitle} value={title} placeholder="שם השאלון"/>
            <div className="create__btns">
                <Button onClick={() => setShow(true)} text="הוספת משתתף " color={1}/>
                {/* <Button text="תוצאות" color={1}/> */}
                <If condition={!!members.length && !!title}>
                    <Button onClick={save} text="שמירה" color={1}/>
                </If>
            </div>
            <MembersTable members={members} />
        </div>
    </InnerPage>
}