import React, { useState } from 'react'
import ProjectService from '../services/ProjectService'
import { AuthContext } from '../context/AuthContext'
import Message from './Message'


function CreateProject(props) {
    // const [project, setProject] = useState({ name: '' })
    // const [message, setMessage] = useState(null)


    function handleSubmit(e){
        e.preventDefault()
        // Lifting state up
        // ProjectService.createProject(project).then(data => {
        //     const { message } = data
            
        //     if(!message.msgError){
        //         console.log('Created new project!')
        //         resetForm()
        //     }else{
        //         setMessage(message)
        //     }
        // })
        console.log('target value: ' + props.project)
        props.onProjectSubmit(props.project)
    }
    function handleChange(e){
        // lifting state up to Todos parent
        // setProject({ name: e.target.value })
        props.onProjectChange({ name: e.target.value })
    }

    // function resetForm(){
    //     setProject({ name: '' })
    // }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="project">Create a new project</label>
                <input type="text"
                        name="project"
                        value={props.project.name}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter new project name" />
                <button className="btn btn-lg btn-primary btn-block" type="submit">Create new project</button>
            </form>
            {/* { message ? <Message message={message} /> : null } */}
        </>
    )
}

export default CreateProject
