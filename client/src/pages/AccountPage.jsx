import { useContext } from "react"
import { UserContext } from "../UserContext"
import { Navigate } from "react-router-dom";

const AccountPage = ()=>{

    const {ready, user} = useContext(UserContext);
    if (ready && !user) {
        return <Navigate to="/login"></Navigate>;
    } else {
        
    }
    return(
        <div>
            this is account page for {user?.name}
        </div>
    )
}

export default AccountPage