import React from 'react'

function SortProject(props) {
    function handleChange(e){
        console.log("Value: " + e.target.value + "; Display: " + e.target[e.target.selectedIndex].text + ".")
        props.onProjectSort(e.target.value, e.target[e.target.selectedIndex].text)
    }

    return (
        <div>
            <h4>Sort by project: </h4>
            <select onChange={handleChange}>
                <option value="all-projects">All Projects</option>
                {
                    props.projects.map(p => {
                        return <option value={p._id} key={p._id} name={p.name}>{p.name}</option>
                    })
                }
            </select>
        </div>
    )
}

export default SortProject
