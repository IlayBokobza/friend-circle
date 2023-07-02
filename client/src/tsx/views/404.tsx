import Button from "../components/general/button";

export default function P404(){
    return <div className="P404">
        <div>
            <h1>404</h1>
            <h2>דף לא קיים</h2>
            <Button linkTo="/" color={3} text="חזרה לעמוד הראשי"></Button>
        </div>
    </div>
}