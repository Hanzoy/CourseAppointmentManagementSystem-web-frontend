import React from 'react';
import './App.css';
import MRoute from "./components/MRoute";
import axios from "axios";

// axios.defaults.baseURL = 'http://127.0.0.1:8080';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const App = () => (
    <div className="App">
      <MRoute/>
    </div>
);

export default App;
