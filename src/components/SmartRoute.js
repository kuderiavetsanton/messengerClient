import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import { useAuthStateContext } from '../context/auth'

export default function SmartRoute(props) {
    const { guest,authenticated } = props
    const { user } = useAuthStateContext()
    if(user && guest){
        return <Redirect to="/"/>
    }
    else if(!user && authenticated){
        return <Redirect to="/login"/>
    }else{
        return <Route component={props.component} {...props} />
    }
}
