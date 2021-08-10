import React, { useState } from 'react'
import ProjectService from '../services/ProjectService'
import { AuthContext } from '../context/AuthContext'
import Message from './Message'


function CreateProject() {
    const [project, setProject] = useState({ name: '' })
    const [message, setMessage] = useState(null)


    function handleSubmit(e){
        e.preventDefault()
        ProjectService.createProject(project).then(data => {
            const { message } = data
            
            if(!message.msgError){
                console.log('Created new project!')
                resetForm()
            }else{
                setMessage(message)
            }
        })
        
    }
    function onChange(e){
        setProject({ name: e.target.value })
    }

    function resetForm(){
        setProject({ name: '' })
    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="project">Create a new project</label>
                <input type="text"
                        name="project"
                        value={project.name}
                        onChange={onChange}
                        className="form-control"
                        placeholder="Enter new project name" />
                <button className="btn btn-lg btn-primary btn-block" type="submit">Create new project</button>
            </form>
            { message ? <Message message={message} /> : null }
        </>
    )
}

export default CreateProject
