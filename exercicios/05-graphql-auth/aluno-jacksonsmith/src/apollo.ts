import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({ uri: 'https://bff.myapp.com/graphql' });

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: { Movie: { keyFields: ['id'] } },
  }),
});

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) { id name email }
  }
`;

export function useUser(id: string) {
  return useQuery(GET_USER, { variables: { id } });
}
