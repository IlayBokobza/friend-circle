import { Quiz } from "../../store/quizSlice";
import { User } from "../../store/userSlice";
import Button from "../components/general/button";
import If from "../components/general/if";
import InnerPage from "../components/innerPage";
import {useSelector} from 'react-redux'

export default function Home(){
    const user:User = useSelector((state:any) => state.user)
    const quizes:Quiz[] = useSelector((state:any) => state.quizes.owned)
    const open = quizes.filter(q => q.open)
    const drafts = quizes.filter(q => !q.open)

    return <InnerPage className="home">
        <h1>שלום, {user.name}</h1>
        <Button linkTo="/create" text="+" round color={3}></Button>
        <div className={"home__container " + (!open.length || !drafts.length ? "home__container--single" : "")}>
            {/* active quizes */}
            <If condition={!!open.length}>
                <div className="home__quizes">
                    <h2>שאלונים פעילים</h2>
                    <div className="home__list">
                        {open.map((q:Quiz) => {
                            return <Button linkTo={`/create?id=${q.id}`} text={q.title} color={1} key={q.id} />
                        })}
                    </div>
                </div>
            </If>
            {/* drafts */}
            <If condition={!!drafts.length}>
                <div className="home__quizes">
                    <h2>טיוטות</h2>
                    <div className="home__list">
                        {drafts.map((q:Quiz) => {
                            return <Button linkTo={`/create?id=${q.id}`} text={q.title} color={1} key={q.id} />
                        })}
                    </div>
                </div>
            </If>
        </div>
    </InnerPage>
}