import './index.css'

const ListTask = props => {
    const {taskData,sno,crud_data} = props
    const {_id,category,name} = taskData
    const editFun = () => {
        crud_data('edit',_id)
    }

    const deleteFun = () => {
        crud_data('delete',_id)
    }
    return (        
        <tr>
            <td>{sno}</td>
            <td>{category}</td>
            <td>{name}</td>
            <td className='d-flex flex-row justify-content-center'>
                <button type='submit' className='btn btn-outline-secondary' onClick={editFun}>Edit</button>
                <span>/</span>
                <button type='submit' className='btn btn-outline-danger' onClick={deleteFun}>X</button>
            </td>
        </tr>
    )
}

export default ListTask