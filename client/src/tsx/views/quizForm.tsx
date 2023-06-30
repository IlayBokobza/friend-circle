import { useState } from "react";
import { Member, MemberMinimal, QuizMinimal } from "../../store/quizSlice"
import QuizLogin from "../components/quizLogin";
import InnerPage from "../components/innerPage";
import { Tooltip } from 'react-tooltip'

export default function QuizForm(){
    let [me,setMe] = useState({} as Member)
    let [quiz,setQuiz] = useState({} as QuizMinimal)
    let otherMembers = quiz.members?.filter((m:MemberMinimal) => m.id !== me.id)

    if(!me.name){
        return <QuizLogin onGetData={setQuiz} onLoggedIn={setMe} />
    }
    

    return <InnerPage className="quizForm" disableLink title={`שלום, ${me.name}`}>
        <div className="quizForm__col">
            <Tooltip anchorSelect="#help__natural">מישהו שאין לך שום קשר איתו</Tooltip>
            <span id="help__natural" className="quizForm__help material-symbols-outlined">help</span>
            <div className="quizForm__title">פסיבי</div>
            <div className="quizForm__col__container">{otherMembers.map((m:MemberMinimal) => <div className="quizForm__member" key={m.id}>{m.name}</div>)}</div>
        </div>
        <div className="quizForm__col">
            <Tooltip anchorSelect="#help__friend">מישהו שיש לך קצת קשר איתו.</Tooltip>
            <span id="help__friend" className="quizForm__help material-symbols-outlined">help</span>
            <div className="quizForm__title">ידיד</div>
            <div className="quizForm__col__container"></div>
        </div>
        <div className="quizForm__col">
            <Tooltip anchorSelect="#help__goodFriend">מישהו שיש לך קשר טוב איתו, ולפעמים אתם עושים פעילות ביחד</Tooltip>
            <span id="help__goodFriend" className="quizForm__help material-symbols-outlined">help</span>
            <div className="quizForm__title">חבר</div>
            <div className="quizForm__col__container"></div>
        </div>
        <div className="quizForm__col">
            <Tooltip anchorSelect="#help__closeFriend">הוא בין החברים הכי טובים שלך. אתם מדברים על בסיס קבוע</Tooltip>
            <span id="help__closeFriend" className="quizForm__help material-symbols-outlined">help</span>
            <div className="quizForm__title">חבר קרוב</div>
            <div className="quizForm__col__container"></div>
        </div>
    </InnerPage>
}