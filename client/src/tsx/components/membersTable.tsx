import {JSX} from "react"

export type Member = {name:string,email:string,password:string}

export default function MembersTable(props:{members:Member[]}){
    if(!props.members.length){
        return <h2>לא הוספת משמתשים</h2>
    }

    const names:JSX.Element[] = []
    const emails:JSX.Element[] = []
    const passswords:JSX.Element[] = []

    props.members.forEach((m:Member) => {
        names.push(<div className="row">{m.name}</div>)
        emails.push(<div className="row">{m.email}</div>)
        passswords.push(<div className="row">{m.password}</div>)
    })

    return <div className="membersTable">
        <div className="row row--main">
            <div className="col">
                <div className="row">:שם</div>
                {names}
            </div>

            <div className="col">
                <div className="row">:אימייל</div>
                {emails}
            </div>

            <div className="col">
                <div className="row">:סיסמה</div>
                {passswords}
            </div>
        </div>
    </div>
}