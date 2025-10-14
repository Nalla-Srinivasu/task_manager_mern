import React from "react";
import { Navigate,useNavigate } from "react-router-dom";
import Cookie from 'js-cookie';

export function withNavigate(Component){
    return props => {        
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />
    }
}

export function ProtectedRoute({Component}){
    const authToken = Cookie.get("AuthID");
    if(!authToken){        
        return <Navigate to="/login" replace />
    }
    return <Component />;
}