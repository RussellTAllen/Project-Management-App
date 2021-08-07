import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from "./components/Register";
import Admin from "./components/Admin";
import Todos from "./components/Todos";
import PrivateRoute from "./hocs/PrivateRoute";
import PublicRoute from "./hocs/PublicRoute";

function App() {

  return (
    <Router>
      <Navbar />
      <Route exact path="/" component={ Home } />
      <PublicRoute path="/login" component={ Login } />
      <PublicRoute path="/register" component={ Register } />
      <PrivateRoute path="/todos" component={ Todos } roles={["user", "admin"]} />
      <PrivateRoute path="/admin" component={ Admin } roles={["admin"]} />
    </Router>
  )
}

export default App;
