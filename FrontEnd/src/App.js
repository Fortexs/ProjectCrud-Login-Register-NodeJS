import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Tablename from "./components/Tablename";


function App() {
  return (
    <BrowserRouter>
      <Routes> 
        <Route path="/" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<><Navbar/><Dashboard/><Tablename/></>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
