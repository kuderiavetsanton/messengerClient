import React, { useState } from 'react';
import { Row, Col, Form, Button} from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { gql, useLazyQuery } from '@apollo/client'

import { useAuthDispatchContext } from '../context/auth'

const LOGIN_USER = gql`
    query login($email:String!,$password:String!){
        login(email:$email,password:$password){
            token
            username
            email
            id
            createdAt
        }
    }
`

export default function Login(props) {
    const [properties,setProperties ] = useState({
        email:'',
        password:''
    })
    const { email, password } = properties

    const dispatch = useAuthDispatchContext()

    //errors
    const [ errors,setErrors ] =  useState({})

    const [loginExec,{ loading }] = useLazyQuery(LOGIN_USER,{
        onError(err){
            console.log({...err})
            setErrors(err.graphQLErrors[0]?.extensions?.errors)
        },
        onCompleted(data){
          dispatch({type:'LOGIN',payload:data.login})
            window.location.href = '/'
        }
    })

    const handleChangeProperties = (e) => {
        setProperties({...properties,[e.target.name]:e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        loginExec({
            variables:properties
        })
    }
    return (
        <Row className="justify-content-center bg-white py-5">
        <Col  sm="10" md="8" lg="6"  >
          <h1 className="text-center">Login</h1>
          <Form onSubmit={handleSubmit}>

            <Form.Group controlId="formBasicEmail">
              <Form.Label className={errors.email && 'text-danger'}>{errors.email ?? 'Email address'}</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} name="email" onChange={handleChangeProperties} className={errors.email && 'is-invalid'}/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label className={errors.password && 'text-danger'}>{errors.password ?? 'Password'}</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} name="password" onChange={handleChangeProperties} className={errors.password && 'is-invalid'}/>
            </Form.Group>
            
            <div className="text-center">
              <Button variant="success" type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
              </Button><br/>
              <small>
                Don't have any account ? <Link to="/register">Register</Link>
              </small>
            </div>
          </Form>
        </Col>
      </Row>
    )
}
