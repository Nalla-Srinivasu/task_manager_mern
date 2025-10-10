import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
// import logo from './logo.svg';
import './App.css';
import Login from './components/login'
import Todo from './components/todo_list'
import NotFound from './components/notfound'

function App() {
  return (
    // <div className="App">
     
    //   {/* <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header> */}
    // </div>
     <Router> 
        <Routes>
          <Route path="/" element={Login}/>
          <Route path="/todo" element={Todo}/>
          <Route element={NotFound}/>        
        </Routes>
      </Router>
  );
}

export default App;
