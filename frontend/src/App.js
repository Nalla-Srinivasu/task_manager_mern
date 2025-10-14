import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {ProtectedRoute} from './common_funtions'
// import logo from './logo.svg';
import './App.css';
import Login from './components/login'
import Todo from './components/todo_list'
import NotFound from './components/NotFound'

const App = () => (   
     <Router> 
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<ProtectedRoute Component={Todo}/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
  );

export default App;
