import Button from "../components/button";
import Dialog from "../components/dialog";
import InnerPage from "../components/innerPage";
import Input from "../components/input";
import {useRef, useState} from 'react'
import MembersTable, { Member } from "../components/membersTable";
import If from "../components/if";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom"
import NewMemberDialog from "../components/newMemberDialog";

type MemberFull = {
    title: string;
    members: {
        response: {
            natrual: never[];
            friend: never[];
            goodFriend: never[];
            closeFriend: never[];
        };
        name: string;
        email: string;
        password: string;
    }[];
}

export default function Create(){
    const showState = useState(false)
    let [_,setShow] = showState
    const navigate = useNavigate()
    
    let [title,setTitle] = useState("")
    let [members,setMembers] = useState([] as Member[])

    //load data if need to
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id")
    
    function addMember(name:string,email:string,password:string){
        setMembers([...members,{name,email,password}])
    }

    async function create(data:MemberFull){
        try{
            const res = await axios.post('/api/quizes',data)
            navigate(`/create?id=${res.data}`)
        }
        catch(e){
            console.warn(e)
        }
    }

    async function update(data:MemberFull){
        try{
            const res = await axios.patch('/api/quizes',data)
            console.log(res.data)
        }
        catch(e){
            console.warn(e)
        }
    }

    function save(){
        const memebersFull = members.map((m:Member) => ({
            ...m,
            response:{
                natrual:[],
				friend:[],
				goodFriend:[],
				closeFriend:[]
            }
        }))
        const data = {
            title,
            members:memebersFull,
        }
        //is new
        if(!id){
            create(data)
        }
        else{
            update(data)
        }
    }

    return <InnerPage>
        <NewMemberDialog addMember={addMember} showSate={showState}/>
        <div className="create">
            <Input setFunc={setTitle} placeholder="שם השאלון"/>
            <div className="create__btns">
                <Button onClick={() => setShow(true)} text="הוספת משתתף " color={1}/>
                <If condition={!!members.length && !!title}>
                    <Button onClick={save} text="שמירה" color={1}/>
                </If>
                {/* <Button text="תוצאות" color={1}/> */}
            </div>
            <MembersTable members={members} />
        </div>
    </InnerPage>
}