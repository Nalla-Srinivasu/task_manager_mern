import { Component } from "react";
import './index.css'


class todo_list extends Component{
    state = {
        category:"",
        name:"",
        error:[],
        responseMsg:"",        
    }

    categoryEvent = event =>{
        this.setState({category:event.target.value})
    }

    categoryNameEvent = event =>{
        this.setState({name:event.target.value})
    }

    onSubmitForm = () => {
        const {category,name} = this.state
        if(category !== "" && name !== ""){
            const data = {
                category:category,
                name:name
            }
            const url = "http://localhost:5000/todo/"
            const options = {
                action:"add_data",
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                data:JSON.stringify(data)
            }

            const response = fetch(url,options)

            if(response.ok){
                this.setState(prevState=>(
                    {responseMsg:{...prevState.responseMsg,responseMsg:"Data add successfully"}}
                ));
            }else{
                this.setState(prevState=>(
                    {responseMsg:{...prevState.responseMsg,responseMsg:"Data doesn't add successfully"}}
                ));
            }

        }else{
            this.setState(prevState=>({
                error:{...prevState.error, category:"please addd the category"}
            }));

            this.setState(prevState=>({
                error:{...prevState.error, name:"please add some data of name"}
            }));
        }
    }

    render(){
        const {category,name,error,responseMsg} = this.state
        return(
            <div className="form-container">
                {responseMsg && <p className="text-warning">{responseMsg}</p>}
                <div className="mb-3 from-group">
                    <label htmlFor="exampleInputEmail1" className="form-label">category</label>
                    <input type="text" 
                    className="form-control" 
                    id="exampleInputEmail1" 
                    aria-describedby="emailHelp" required 
                    onChange={this.categoryEvent}
                    value={category}
                    />                    
                </div>
                {error.category && <p className="text-danger">{error.category}</p>}
                <div className="mb-3 from-group">
                    <label htmlFor="exampleInputPassword1" className="form-label">Name</label>
                    <input type="text" 
                    className="form-control" 
                    id="exampleInputPassword1" 
                    required 
                    onChange={this.categoryNameEvent}
                    value={name}
                    />
                </div>  
                {error.name && <p className="text-danger">{error.name}</p>}
                <button type="submit" className="btn btn-primary w-25" onClick={this.onSubmitForm}>Submit</button>
            </div>
        )
    }
}

export default todo_list