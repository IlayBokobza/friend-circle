import { Quiz } from "../../store/quizSlice";
import { User } from "../../store/userSlice";
import Button from "../components/button";
import InnerPage from "../components/innerPage";
import {useSelector} from 'react-redux'

export default function Home(){
    const user:User = useSelector((state:any) => state.user)
    const quizes:Quiz[] = useSelector((state:any) => state.quizes.owned)

    return <InnerPage className="home">
        <h1>שלום, {user.name}</h1>
        <Button linkTo="/create" text="+" round color={3}></Button>
        <div className="home__quizes">
            {quizes.map((q:Quiz) => {
                return <div key={q.id}><Button linkTo={`/create?id=${q.id}`} text={q.title} color={1} /></div>
            })}
        </div>
    </InnerPage>
}