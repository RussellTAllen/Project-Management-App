import React from 'react'

function SortProject(props) {
    function handleChange(e){
        console.log(e.target.value)
        props.onProjectSort(e.target.value)
    }

    return (
        <div>
            <h4>Sort by project: </h4>
            <select onChange={handleChange}>
                <option value="all-projects">All Projects</option>
                {
                    props.projects.map(p => {
                        return <option value={p._id} key={p._id}>{p.name}</option>
                    })
                }
            </select>
        </div>
    )
}

export default SortProject
