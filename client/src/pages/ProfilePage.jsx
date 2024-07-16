import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

const ProfilePage = () => {
  const { ready, user, setUser } = useContext(UserContext);
  const { subpage } = useParams();
  const [redirect, setRedirect] = useState(null);
  if (!ready) {
    return "loading";
  }
  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  const logOut = async () => {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  };

  if (redirect) {
    return <Navigate to={"/"}></Navigate>;
  }

  return (
    <div>
      <AccountNav/>
      {subpage === undefined && (
        <div className="text-center max-w-lg mx-auto">
          logged in as {user.name} ({user.email}) <br />
          <button onClick={logOut} className="primary max-w-sm mt-2">
            Log out
          </button>
        </div>
      )}

      {subpage === "places" && (
        <div className="text-center max-w-lg mx-auto">
          <PlacesPage></PlacesPage>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
