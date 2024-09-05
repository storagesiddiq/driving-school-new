import { useState } from "react";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import './App.css'
import Footer from "./Components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {

    return (<>
        <Navbar/>
        <Home/>
        <Footer/>
       </> 
    );
}
