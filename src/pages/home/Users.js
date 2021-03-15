import React from 'react';
import { useQuery, gql } from '@apollo/client'
import { Col, Image } from 'react-bootstrap'

import { useMessageState, useMessageDispatch } from '../../context/messages'

const GET_USERS = gql`
    {
        getUsers{
            email
            username
            id
            imageUrl
            latestMessage{
                content
            }
        }
    }
`

const Users = () => {
    const dispatch = useMessageDispatch()
    const state = useMessageState()

    const { data, loading, error } = useQuery(GET_USERS,{
        onError(err){
            console.log({...err})
        },
        onCompleted(data){
            dispatch({type:'SET_USERS',payload:{ users:data.getUsers }})
        }
    })

    const selectUser = (id) => {
        dispatch({type:'SELECT_USER',payload:id})
    }

    let usersMarkup;
    if(!data || loading){
        usersMarkup = <p className="p-2">Loading...</p>
    }else if(data.getUsers.length === 0){
        usersMarkup = <p className="p-2">You are alone</p>
    }else if(data){
        usersMarkup = state.users?.map(user => {
            return (
                <div key={user.id} className={user.selected ? 'bg-white p-3 d-flex cursor-pointer justify-content-center justify-content-md-start' : 'bg-secondary p-3 d-flex cursor-pointer justify-content-center justify-content-md-start'} onClick={() => selectUser(user.id)}>
                    <Image src={user.imageUrl} roundedCircle style={{width:'50px',height:"50px"}} />
                    <div className="d-none d-md-block ml-2">
                        <p className="text-primary">{user.username}</p>
                        <p className="font-weight-light">{!user.latestMessage ? 'You are now connected' : user.latestMessage.content}</p>
                    </div>
                </div>
            )
        })
    }

    return (
        <Col xs="2" md="4"  className="p-0 bg-secondary">
            {usersMarkup}
        </Col>
    );
}

export default Users;
