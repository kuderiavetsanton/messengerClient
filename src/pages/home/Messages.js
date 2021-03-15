import React, { useEffect,useState } from 'react'
import {  gql, useLazyQuery, useMutation, useSubscription } from '@apollo/client'

import { Form, Col } from 'react-bootstrap'

import { useMessageState, useMessageDispatch } from '../../context/messages'
import Message from '../../components/Message'

const GET_MESSAGES = gql`
    query getMessages($from:ID!){
    getMessages(from:$from){
        id
        createdAt
        content
        from 
        to
        reactions{
            id
            content
        }
    }
    }
`
const SEND_MESSAGE = gql`
    mutation sendMessage($to:ID!,$content:String!){
        sendMessage(to:$to,content:$content){
                createdAt
                to
                from
                id
                content
        }
    }
`

const NEW_MESSAGE = gql`
    subscription{
        newMessage{
            createdAt
            to
            from
            id
            content
        }
    }
`

const NEW_REACTION = gql`
    subscription{
        newReaction{
            id
            content 
            message{
                id
                from
                to
            }
        }
    }
`

export default function Messages() {
    const dispatch = useMessageDispatch()
    const state = useMessageState()

    let selectedUser = state.users?.find( u => u.selected )

    const [content, setContent] = useState('')

    const [ getMessages, { data:selectedData, loading:selectedLoading } ] = useLazyQuery(GET_MESSAGES,{
        onCompleted(data){
            dispatch({type:'SET_MESSAGES',payload:{ id:selectedUser.id, messages:data.getMessages}})
        }
    })

    const [sendMessage, ] = useMutation(SEND_MESSAGE,{
        onError(err){
            console.log({...err})
        },
        onCompleted(data){
            dispatch( { type:'SET_MESSAGE',payload:{ id:data.sendMessage.to, message:data.sendMessage } } )
        }
    })
    
    const {data:newMessageData} = useSubscription(NEW_MESSAGE,{
        onSubscriptionData({ subscriptionData: { data: { newMessage }}}){
            dispatch( { type:'SET_MESSAGE',payload:{ id:newMessage.from, message:newMessage } } )
        }
    })

    const {data:newReactData} = useSubscription(NEW_REACTION,{
        onSubscriptionData({ subscriptionData: { data: { newReaction }}}){
            dispatch( { type:'SET_REACTION',payload:{ to:newReaction.message.to,from:newReaction.message.from, messageId:newReaction.message.id, reaction: {content:newReaction.content, id:newReaction.id} } } )
        }
    })
    useEffect(() => {
        if(selectedUser && !selectedUser.messages){
            getMessages({
                variables:{from:selectedUser.id}
            })
        }
    },[selectedUser])

    const handleSendMessage = e => {
        e.preventDefault()

        if(content.trim() === '') return

        sendMessage({
            variables:{ to:selectedUser.id, content }
        })

        setContent('')
    }
    let messageMarkup
    if(!selectedUser?.messages && !selectedLoading){
        messageMarkup = <h5 className="info__text mb-4">Select a friend</h5>
    }else if(selectedLoading){
        messageMarkup = <p className="info__text mb-2">Loading...</p>
    }else if(selectedUser && selectedUser.messages?.length === 0){
        messageMarkup = <p className="info__text mb-2">You are now connected</p>
    }else if(selectedUser && selectedUser.messages){
        messageMarkup = selectedUser.messages.map(message => {
            return <Message key={message.id} message={message}/>
        })
    }
    
    return (
        <Col xs="10" md="8" className="px-3 message-box">
                <div className=" d-flex flex-column justify-content-end message-sub-box">
                    <div className="d-flex flex-column-reverse mb-3">
                        {messageMarkup}
                    </div>
                    <Form onSubmit={handleSendMessage} className={selectedUser ? '' : 'd-none'}>
                        <Form.Group className="d-flex align-content-center">
                            <Form.Control value={content} placeholder="Enter a message here" onChange={e => setContent(e.target.value)} className="bg-secondary rounded-pill border-0 message-input p-3"/>
                            <i className="fas fa-paper-plane fa-2x ml-2 text-primary" role="button" onClick={handleSendMessage}></i>
                        </Form.Group>
                    </Form>
                </div>
        </Col>
    )
}
