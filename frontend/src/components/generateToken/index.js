import {Component} from 'react';

class GenerateToken extends Component{  
    createToken = async(props) => {
        const url = "http://localhost:5000/generateToken";
        const data = {
            action:"generate_token",
            ...props
        }
        const requestOptions = {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(data)
        }
        const response = await fetch(url,requestOptions)

        if(response.status === 200){
            const res =  await response.json();
            if(res.status === "success"){
                const set_token = await localStorage.setItem("token", res.token)
                if(set_token){
                    return res.token;
                }
            }else if(res.status === "fail"){
                localStorage.removeItem("token") 
                return false;               
            }
        }else{
            localStorage.removeItem("token");
            console.error("Error in generating token");            
        }
    }
}

export default GenerateToken;