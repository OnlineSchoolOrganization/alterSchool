import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export const link = createHttpLink({
  uri: '/graphql',
  credentials: 'include',
})

export const apolloClient = new ApolloClient({
  dataMasking: true,
  link: authLink.concat(link),
  cache: new InMemoryCache(),
})
