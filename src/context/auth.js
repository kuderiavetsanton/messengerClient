import React, { useContext, createContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode'

const AuthStateContext = createContext()
const AuthDispatchContext = createContext()

let user = null;

const token = localStorage.getItem('token')

if(token) {
    let decodedToken = jwtDecode(token)

    const expiresAt = new Date( decodedToken.exp * 1000 )
    if(new Date() > expiresAt){
        localStorage.removeItem('token')
    }else{
        user = decodedToken
    }
}

const authReducer = (state,action) => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('token',action.payload.token)
            return { ...state, user:action.payload }
            break;
        
        case 'LOGOUT':
            localStorage.removeItem('token')
            return { ...state, user:null }
            break;
        default:
            throw new Error('Action with this type dont exist')
    }
}

export const AuthProvider = ({ children }) => {
    const [state,dispatch] = useReducer(authReducer,{ user })

    return <AuthStateContext.Provider value={ state }>
        <AuthDispatchContext.Provider value={ dispatch }>
            { children }
        </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
}

export const useAuthStateContext = () => useContext(AuthStateContext)
export const useAuthDispatchContext = () => useContext(AuthDispatchContext)