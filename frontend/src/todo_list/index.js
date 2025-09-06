import { Component } from "react";
import './index.css'
import ListTask from '../ListTask'


class todo_list extends Component{
    state = {
        category:"",
        name:"",
        error:[],
        responseMsg:"",
        task_Data:[]
    }
    componentDidMount(){
        this.getListData();
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
                action:"add_data",
                category:category,
                name:name
            }
            const url = "http://localhost:5000/todo"
            const options = {                
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            }

            const response = fetch(url,options)

            if(response.ok){
                this.setState({responseMsg:"Data add successfully"});
            }else{
                this.setState({responseMsg:"Data doesn't add successfully"});
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

    getListData = async() => {        
        const data = {
            action:"get_data"
        }
        const url = "http://localhost:5000/todo"
        const options = {                
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
        }

        const response = fetch(url,options)

        if(response.ok){
            this.setState({task_Data:response.Details});
            this.renderListofData();
        }else{
            this.setState({responseMsg:"Data doesn't exist"});
        }
    }

    renderListofData = () => {
        const {task_Data} = this.state
        if(!task_Data){
            return (
                <table className="table table-striped table-hover">
                    <thead>
                        <th>#ID</th>
                        <th>category</th>
                        <th>Name</th>
                        <th>Action</th>
                    </thead>
                    {task_Data.map(eachItem => (
                        <ListTask taskData={eachItem} key={eachItem.id} />
                    ))}
                </table>
            )
        }else{
            return(
                <div class="alert alert-danger m-3" role="alert">
                    Data not found, please add some Data
                </div>
            )
        }
    }

    render(){
        const {category,name,error,responseMsg} = this.state
        return(
            <div className="form-container">
                {responseMsg && <p className="text-warning">{responseMsg}</p>}
                <div className="mb-3 row">
                    <label htmlFor="staticEmail" className="col-sm-2 col-form-label">category</label>
                    <input type="text" 
                    className="form-control" 
                    id="staticEmail" 
                    aria-describedby="emailHelp" required 
                    onChange={this.categoryEvent}
                    value={category}
                    />                    
                </div>
                {error.category && <p className="text-danger">{error.category}</p>}
                <div className="mb-3 row">
                    <label htmlFor="exampleInputPassword1" className="col-sm-2 col-form-label">Name</label>
                    <input type="text" 
                    className="form-control" 
                    id="exampleInputPassword1" 
                    required 
                    onChange={this.categoryNameEvent}
                    value={name}
                    />
                </div>  
                {error.name && <p className="text-danger">{error.name}</p>}
                <button type="submit" className="btn btn-primary add_btn" onClick={this.onSubmitForm}>+</button>
                {this.renderListofData()}
            </div>
        )
    }
}

export default todo_list