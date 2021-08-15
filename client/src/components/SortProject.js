import React from 'react'

function SortProject() {
    return (
        <div>
            <h4>Sort by project: </h4>
            <select onChange={handleSortProjectChange}>
                <option value="all-projects">All Projects</option>
                {
                    projects.map(p => {
                        return <option value={p._id} key={p._id}>{p.name}</option>
                    })
                }
            </select>
        </div>
    )
}

export default SortProject
