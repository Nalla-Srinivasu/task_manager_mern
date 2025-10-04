import { Component } from "react";
import './index.css'
import ListTask from '../ListTask'
import GenerateToken from "../generateToken";

class todo_list extends Component{
    state = {
        category:"",
        name:"",
        error:[],
        responseMsg:"",
        taskData:[],
        is_loading: false,
        input_action:"add_data",
        data_id:""
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

    checkToken = async(props) => {        
        const getToken = new GenerateToken();
        const token_res = getToken.createToken({props});
        if(token_res){
            const setToken = localStorage.getItem("token");
            return setToken;
        }else{
            this.setState({responseMsg:"Token is not generating"})
            localStorage.removeItem("token")
            console.error("Token is not generating")
            return false;
        }        
    }

    onSubmitForm = async () => {
        const {category,name,input_action} = this.state
        if(category !== "" && name !== ""){
            const data = {
                action:input_action,
                category:category,
                name:name,
                data_id:this.state.data_id
            }
            const checkToken = await this.checkToken(data);
            if(checkToken){
                const {token} = await this.state;
                const url = "http://localhost:5000/todo"
                const options = {                
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body:JSON.stringify(data)
                }

                const response = await fetch(url,options)            
                const insertion_res =  await response.json();
                if(insertion_res.data.status === "error"){
                    localStorage.removeItem("token");
                    this.setState({responseMsg:insertion_res.data.res_msg})
                    this.onSubmitForm();
                }
                if(response.status === 200){
                    if(insertion_res.status === "success"){
                        localStorage.removeItem("token");                        
                        this.setState({responseMsg:"Data " + (input_action === "add_data"?"added":"updated") +" successfully",category:"",name:"",error:[],input_action:"add_data"});
                        await this.getListData();
                    }else{
                        this.setState({responseMsg:"Data doesn't add successfully"});
                    }
                }else{
                    this.setState({responseMsg:"Data doesn't add successfully"});
                }
            }else{
                localStorage.removeItem("Token");
                this.setState({ responseMsg:"Token is expired / not generating"});
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
        const checkToken = await this.checkToken(data);
        console.log(checkToken);
        const token = checkToken !== "" && checkToken !== null && checkToken !== undefined ? checkToken : false;
        console.log(token);
        if(token){            
            console.log("token",token)            
            const url = "http://localhost:5000/todo"
            const options = {
                method:"POST",
                headers: {
                    'Content-Type':'application/json',
                    "Authorization": "Bearer " + token
                },
                body:JSON.stringify(data)
            }

            const response = await fetch(url,options)
            const result = await response.json();
            if(result.status === "error"){
                localStorage.removeItem("token");
                this.setState({responseMsg:result.msg})
                this.getListData();
            }
            if(response.ok){
                localStorage.removeItem("token");
                this.setState({taskData:result.Details,is_loading:true});            
            }else{
                this.setState({responseMsg:"Data doesn't exist"});
            }
        }else{
            localStorage.removeItem("token");
            this.setState({responseMsg:"Token is expired / not generating"})
        }
    }

    renderListofData = () => {
        const {taskData} = this.state
        if(taskData){            
            return (
                <table className="table table-striped table-hover"> 
                    <thead>
                        <tr>
                            <th>#ID</th>
                            <th>category</th>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {taskData.map((eachItem,index) => (                        
                        <ListTask taskData={eachItem} key={eachItem._id} sno={index+1} crud_data={this.crudData}/>
                    ))}
                    </tbody>
                </table>
            )
        }else{
            return(
                <div className="alert alert-danger m-3" role="alert">
                    Data not found, please add some Data
                </div>
            )
        }
    }

    DeleteData = async (data_id,delete_confirm=false) => {
        delete_confirm = !delete_confirm?window.confirm("Are you sure want to delete this data?"):true
        const delete_data = {
            action:"delete_data",
            data_id:data_id
        }
        const checkToken = await this.checkToken(delete_data)
        if(checkToken){
            const {token} = await this.state;
            if(delete_confirm === true){

                const options = {
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body:JSON.stringify(delete_data)

                }
                const url = "http://localhost:5000/todo"
                await fetch(url,options).then(async response => {
                    const result = await response.json();
                    if(result.data.status === "error"){
                        localStorage.removeItem("token");
                        this.setState({responseMsg:result.data.res_msg})
                        this.DeleteData(data_id,true)
                    }
                    if(response.ok){
                        try{
                            result.then(data => {
                                if(data.status === "success"){
                                    localStorage.removeItem("token");
                                    this.setState({responseMsg:data.res_msg})
                                    this.getListData()
                                }else{
                                    this.setState({responseMsg:data.res_msg})
                                }
                            })
                        }catch(e){
                            this.setState({responseMsg:response.data.res_msg})
                        }
                    }else{                        
                        this.setState({responseMsg:response.data.res_msg})
                    }
                })
            }
        }else{
            localStorage.removeItem("token");
            this.setState({responseMsg:"Token is expired / not generating"});
        }
    }

    crudData = (type,id) => {
        if(type === 'edit'){
            this.setState({input_action:"update_data"})
            const {taskData}  = this.state
            const taskDataItem = taskData.find(eachItem => eachItem._id === id)                        
            this.setState({category:taskDataItem.category,name:taskDataItem.name,data_id:taskDataItem._id})
        }else if(type === 'delete'){
            this.DeleteData(id)
        }else{
            this.setState({input_action:"add_data",category:"",name:"",data_id:"",error:[],responseMsg:"Data doesn't delete successfully"})
        }
    }

    cancelCrud = () => {
        this.setState({input_action:"add_data",category:"",name:"",data_id:""})
    }


    render(){
        const {category,name,error,responseMsg,is_loading,input_action} = this.state
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
                <div className="d-flex flex-row justify-content-between">
                    <button type="submit" className="btn btn-primary add_btn" onClick={this.onSubmitForm}>+</button>
                    {input_action === 'update_data' && <button type="submit" className="btn btn-primary add_btn" onClick={this.cancelCrud}>x</button>}
                </div>
                {is_loading && this.renderListofData()}
            </div>
        )
    }
}

export default todo_list