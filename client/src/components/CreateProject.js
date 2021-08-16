import React, { useState } from 'react'
import Message from './Message'


function CreateProject(props) {

    function handleSubmit(e){
        e.preventDefault()
        
        props.onProjectCreateSubmit(props.createProject)
    }
    function handleChange(e){
        console.log(e.target.value)
        props.onProjectCreateChange({ name: e.target.value })
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="project">Create a new project</label>
                <input type="text"
                        name="project"
                        value={props.createProject.name}
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
