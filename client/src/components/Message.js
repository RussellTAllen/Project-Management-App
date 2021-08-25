import React from 'react'

function getStyle(props){
    let baseClass = 'alert'
    if(props.message.msgError)
        baseClass = baseClass + ' alert-danger'
    else
        baseClass = baseClass + ' alert-primary'
    return baseClass + ' text-center'
}

function Message(props) {

    console.log(props)
    return (
        <div className={getStyle(props)} role="alert">
            {props.message.msgBody}
        </div>
    )
}

export default Message
