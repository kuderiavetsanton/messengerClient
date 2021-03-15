import React, { useState } from 'react';
import { Row, Col, Form, Button} from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { gql, useMutation } from '@apollo/client'

const SIGNUP_USER = gql`
    mutation signUp($email:String!,$username:String!,$imageUrl:String,$password:String!,$confirmPassword:String!){
        signUp(email:$email,username:$username,imageUrl:$imageUrl,password:$password,confirmPassword:$confirmPassword){
            id
            username
            email
            createdAt
        }
    }
`

export default function Register(props) {
    const [properties,setProperties ] = useState({
        email:'',
        imageUrl:'',
        username:'',
        password:'',
        confirmPassword:''
    })
    const { email, imageUrl, username,password, confirmPassword } = properties

    //errors
    const [ errors,setErrors ] =  useState({})

    const [signUpExec,{ loading }] = useMutation(SIGNUP_USER,{
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.errors)
        },
        update(cache,result){
            props.history.push('/login')
        }
    })

    const handleChangeProperties = (e) => {
      setProperties({...properties,[e.target.name]:e.target.value})
    }

    const handleSubmit = (e) => {
        console.log(properties)
        e.preventDefault()
        signUpExec({
            variables:properties
        })
    }
    return (
        <Row className="justify-content-center bg-white py-5">
        <Col  sm="10" md="8" lg="6"  >
          <h1 className="text-center">Registration</h1>
          <Form onSubmit={handleSubmit}>

            <Form.Group controlId="formBasicEmail">
              <Form.Label className={errors.email && 'text-danger'}>{errors.email ?? 'Email address'}</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} name="email" onChange={handleChangeProperties} className={errors.email && 'is-invalid'}/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label className={errors.username && 'text-danger'}>{errors.username ?? 'Username'}</Form.Label>
              <Form.Control type="text" placeholder="Username" value={username} name="username" onChange={handleChangeProperties} className={errors.username && 'is-invalid'}/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Image Url</Form.Label>
              <Form.Control type="text" placeholder="Enter Image Url" value={imageUrl} name="imageUrl" onChange={handleChangeProperties}/>
              <Form.Text className="text-muted">
                This field is not required
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label className={errors.password && 'text-danger'}>{errors.password ?? 'Password'}</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} name="password" onChange={handleChangeProperties} className={errors.password && 'is-invalid'}/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label className={errors.confirmPassword && 'text-danger'}>{errors.confirmPassword ?? 'Confirmation'}</Form.Label>
              <Form.Control type="password" placeholder="Conforamtion" value={confirmPassword} name="confirmPassword" onChange={handleChangeProperties} className={errors.confirmPassword && 'is-invalid'}/>
            </Form.Group>
            
            <div className="text-center">
              <Button variant="success" type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Register'}
              </Button><br/>
              <small>
                Alredy have an account ? <Link to="/login">Login</Link>
              </small>
            </div>
          </Form>
        </Col>
      </Row>
    )
}
