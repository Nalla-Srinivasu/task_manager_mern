import './index.css'

const ListTask = props => {
    const {taskData} = props
    const {category,name} = taskData
    return (
        <tr>
            <td>{category}</td>
            <td>{name}</td>
            <td className='d-flex flex-row'>
                <button type='submit' className='btn btn-secondary'>Edit</button>
                <span>/</span>
                <button type='submit' className='btn btn-danger'>X</button>
            </td>
        </tr>
    )
}

export default ListTask