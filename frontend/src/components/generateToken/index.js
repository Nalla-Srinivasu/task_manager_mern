import {Component} from 'react';
import Cookies from 'js-cookie';

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
                const set_token = Cookies.set("token", res.token,{expires: 30/1440}); // Expires in 30 minutes
                if(set_token){
                    return res.token;
                }
            }else if(res.status === "fail"){
                Cookies.remove("token") 
                return false;               
            }
        }else{
            Cookies.remove("token");
            console.error("Error in generating token");            
        }
    }
}

export default GenerateToken;