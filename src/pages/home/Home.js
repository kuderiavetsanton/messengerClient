import React from 'react'
import { Row, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuthDispatchContext } from '../../context/auth'
import Messages from './Messages'

import Users from './Users'

export default function Home() {
    const dispatch = useAuthDispatchContext()

    const handleLogOut = (e) => {
        dispatch({type:"LOGOUT"})
        window.location.href = '/login'
    }
    return (
        <>
            <Row className="justify-content-around bg-white mb-1">
                <Link to="/login">
                    <Button variant="link">
                        Login
                    </Button>
                </Link>
                <Link to="/register">
                    <Button variant="link">
                        Register
                    </Button>
                </Link>
                <Button variant="link" onClick={handleLogOut}>
                    Logout
                </Button>
            </Row>
            <Row className="bg-white">
                <Users />
                <Messages />
            </Row>
        </>
    )
}
