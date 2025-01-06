import "../styles/Home.css"
import Form from "../components/Form"



const register=()=>{
    window.location.href="/register";
}
function Login(){
    return (
        <div>
    <Form route="api/token/" method="login"/>
    <button className="register-btn" onClick={register}>Register</button>
    </div>
    )

}
export default Login