import React, { useContext, useState } from 'react'
import ProjectService from '../services/ProjectService'
import Message from './Message'
import { MessageContext } from './Todos'


function CreateProject(props) {
    const [createProject, setCreateProject] = useState({ name: '' })
    const { setMessage } = useContext(MessageContext)

    function onProjectCreateChange(event){
        setCreateProject(event.target.value)
    }

    function onProjectCreateSubmit(e){
        e.preventDefault()
        const createProject = e.target.value
        console.log('project: '+createProject)
        ProjectService.createProject(createProject).then(data => {
            const { message } = data
            console.log('data from handleProject submission: ')
            console.log(data)
            
            if(!message.msgError){
                console.log('Created new project!')
                resetProjectForm()
            }else{
                setMessage(message)
            }
        })
    }

    function resetProjectForm(){
        console.log('trying to reset project form...')
        setCreateProject({ 'name': ''})
    }

    return (
        <>
            <form onSubmit={onProjectCreateSubmit}>
                <label htmlFor="project">Create a new project</label>
                <input type="text"
                        name="project"
                        value={createProject.name}
                        onChange={onProjectCreateChange}
                        className="form-control"
                        placeholder="Enter new project name" />
                <button className="btn btn-lg btn-primary btn-block" type="submit">Create new project</button>
            </form>
            {/* { message ? <Message message={message} /> : null } */}
        </>
    )
}

export default CreateProject
