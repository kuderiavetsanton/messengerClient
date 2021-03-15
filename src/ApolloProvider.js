import React from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider as Provider, ApolloLink, HttpLink,split } from '@apollo/client';

import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

let httpLink = new HttpLink({ uri: process.env.REACT_APP_SERVER_HTTP })

const authLink = new ApolloLink((operation,forward) => {
  const token = localStorage.getItem('token')

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    }
  })

  return forward(operation)
})

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_SERVER_WS,
  options: {
    reconnect: true,
    connectionParams: { 
        Authorization:`Bearer ${localStorage.getItem('token')}`,    
    }
  }
});
httpLink = authLink.concat(httpLink)
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);




const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

export default function ApolloProvider(props) {
    return (
        <Provider {...props} client={client}  /> 
    )
}
