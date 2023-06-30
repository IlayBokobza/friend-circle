import { User } from "../../store/userSlice";
import Button from "../components/button";
import InnerPage from "../components/innerPage";
import {useSelector} from 'react-redux'

export default function Home(){
    const user:User = useSelector((state:any) => state.user)

    return <InnerPage>
        <h1>שלום, {user.name}</h1>
        <Button linkTo="/create" text="+" round color={3}></Button>
    </InnerPage>
}