import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// HTTP Link for GraphQL API
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

// Middleware to add the token to headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Initialize Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Attach auth middleware to HTTP link
  cache: new InMemoryCache(),
});

export default client;
