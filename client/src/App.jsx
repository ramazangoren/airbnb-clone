import "./App.css";
import {Route, Routes} from 'react-router-dom'
import IndexPage from "./pages/IndexPage.jsx";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
// import {useEffect} from "react";

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
    <Routes>
      <Route path="/" element={<Layout/>}> 
        <Route path="/" element={<IndexPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/account" element={<AccountPage/>}/>
      </Route>
    </Routes>
    </UserContextProvider>
  );
}

export default App;
