import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const nameHandler = (e) => {
    setName(e.target.value);
  };
  const emailHandler = (e) => {
    setEmail(e.target.value);
  };
  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };
  const registerUser = async(e) => {
    e.preventDefault();
    try {
      await axios.post("/register", {
        name,
        email,
        password,
      });
      alert('registiration completed')
    } catch (error) {
      alert('registration failed')
    }
  };
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mt-32">
        <h1 className="text-4xl text-center mb-4">register</h1>
        <form action="" className="max-w-md mx-auto " onSubmit={registerUser}>
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={nameHandler}
          />
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={emailHandler}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={passwordHandler}
          />
          <button className="primary">register</button>
          <div className="text-center py-2 text-gray-500">
            have an acount yet?{" "}
            <Link to="/login" className="underline text-blue-500">
              Login now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
