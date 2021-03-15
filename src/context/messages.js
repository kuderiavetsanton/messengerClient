import React, { createContext, useContext, useReducer } from 'react';

const MessageDispatchContext = createContext()
const MessageStateContext = createContext()

const messagesReducer = (state,action) => {
    let usersCopy
    let { id, messages, message, messageId, to, from , reaction } = action.payload
    let userIndex
    switch (action.type) {
        case 'SET_USERS':
            return {
                ...state,
                users:action.payload.users
            }
            break;
        case 'SET_MESSAGES':
            usersCopy = [ ...state.users ]
            userIndex = usersCopy.findIndex(u => u.id === id)
            usersCopy[userIndex] = { ...usersCopy[userIndex], messages}
            return {
                ...state,
                users:usersCopy
            }
            break;
        case 'SELECT_USER':
            usersCopy = state.users.map(u => ({ ...u, selected:u.id === action.payload}))
            return {
                ...state,
                users:usersCopy
            }
            break;
        case 'SET_MESSAGE':
            usersCopy = [ ...state.users ]
            userIndex = usersCopy.findIndex(u => u.id === id)
            message.reactions = []
            if(usersCopy[userIndex].messages){
                usersCopy[userIndex] = { ...usersCopy[userIndex], messages:[message,...usersCopy[userIndex].messages],latestMessage:message}
            }else{
                usersCopy[userIndex] = {...usersCopy[userIndex],latestMessage:message}
            }
            
            return {
                ...state,
                users:usersCopy
            }
        case 'SET_REACTION':
            usersCopy = [ ...state.users ]
            userIndex = usersCopy.findIndex(u => u.id === to || u.id === from)
            if(usersCopy[userIndex].messages){
                usersCopy[userIndex].messages = usersCopy[userIndex].messages.map(m => {
                    let newMessage = {...m}
                    newMessage.reactions = [...newMessage.reactions]
                    if(m.id === messageId){
                        let reactionIndex = newMessage.reactions.findIndex(r => r.id === reaction.id)
                        if(reactionIndex === -1){
                            newMessage.reactions  = [ reaction, ...newMessage.reactions ]
                        }else{
                            newMessage.reactions[reactionIndex] = reaction
                        }
                        
                    }
                    return newMessage
                })
            }
            return {
                ...state,
                users:usersCopy
            }
        default:
            throw new Error('Action with this type dont exist');
    }
}


export const MessagesProvider = ({ children }) => {
    const [state,dispatch] = useReducer(messagesReducer,{ users:null })
    return (
        <MessageStateContext.Provider value={state}>
            <MessageDispatchContext.Provider value={ dispatch }>
                { children }
            </MessageDispatchContext.Provider>
        </MessageStateContext.Provider>
    );
}


export const useMessageDispatch = () => useContext(MessageDispatchContext)
export const useMessageState = () => useContext(MessageStateContext)