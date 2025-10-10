import { Component } from "react";

import './index.css';

class login extends Component {
    state = {
        username: '',
        password: '',
        varErrors: [],
    }
    usernamevalue = (e) => {
        this.setState({username: e.target.value});
    }
    
    passwordvalue = (e) => {
        this.setState({password: e.target.value});
    }

    onValidate = (varname) =>{
        const {varErrors} = this.state;
        if(varname === 'username' || varname === 'all'){
            if(this.state.username === ''){
                this.setState(prevState =>({
                    varErrors: {...prevState.varErrors, username: 'Username is required'}
                }))
            }else{
                this.setState(prevState =>({
                    varErrors: {...prevState.varErrors, username: ''}
                }))
            }
        }

        if(varname === 'password' || varname === 'all'){
            if(this.state.password === ''){
                this.setState(prevState =>({
                    varErrors:{...prevState.varErrors,password: 'Password is required'}
                }))
            }else{
                this.setState(prevState =>({
                    varErrors:{...prevState.varErrors,password:''}
                }))
            }
        }        

        if(varErrors.username === '' || varErrors.password === ''){
            return true;
        }else{
            return false;
        }
    }

    login = () =>{
        const validate = this.onValidate('all')
        if(validate){
            const {username,password} = this.state;
            const data = {
                username:username,
                password:password
            }

            // Here you would typically send the data to your backend for authentication
            const url = 'http://localhost:5000/login'; // Adjust the URL as needed
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }

            const response = fetch(url,options)
            if(response.ok){
                console.log("Login successful");
            }else{
                console.error("Login failed");
            }
        }
    }

    render(){
        const {username,password,varErrors} = this.state;
        console.log(varErrors);
        return(
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-4xl font-bold mb-6">Login Page</h1>
                <form className="bg-white p-8 rounded shadow-md w-96">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Username"
                            value={username}
                            onChange={this.usernamevalue} 
                            onBlur={() => this.onValidate('username')}
                        />
                        {varErrors.username && <p className="text-red-500 text-xs italic">{varErrors.username}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Password"
                            value={password}
                            onChange={this.passwordvalue}
                            onBlur={() => this.onValidate('password')}
                        />
                        {varErrors.password && <p className="text-red-500 text-xs italic">{varErrors.password}</p>}
                    </div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline login-cursor"
                        type="button" onClick={this.login}
                    >
                        Login
                    </button>   
                </form>
            </div>        )
    }
}

export default login;