import gql from 'graphql-tag';

// Schema GraphQL do CineHub (BFF). Domínio de filmes + usuários/favoritos/listas.
export const typeDefs = gql`
  type Movie {
    id: Int!
    title: String!
    overview: String!
    posterPath: String
    releaseDate: String!
    voteAverage: Float!
  }

  type MoviePage {
    page: Int!
    results: [Movie!]!
    totalPages: Int!
    totalResults: Int!
  }

  type User {
    id: ID!
    email: String!
    name: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type MovieList {
    id: ID!
    name: String!
    owner: User!
    movies: [Movie!]!
  }

  type Query {
    "Catálogo paginado de filmes populares."
    popularMovies(page: Int = 1, pageSize: Int = 6): MoviePage!
    "Busca por título."
    searchMovies(query: String!): [Movie!]!
    "Detalhe de um filme."
    movie(id: Int!): Movie
    "Usuário autenticado (precisa de token)."
    me: User
    "Favoritos do usuário autenticado."
    myFavorites: [Movie!]!
    "Favoritos de um usuário arbitrário."
    favoritesOf(userId: ID!): [Movie!]!
    "Uma lista de filmes."
    list(id: ID!): MovieList
  }

  type Mutation {
    register(email: String!, password: String!, name: String): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    addFavorite(movieId: Int!): [Movie!]!
    removeFavorite(movieId: Int!): [Movie!]!
    createList(name: String!): MovieList!
    addMovieToList(listId: ID!, movieId: Int!): MovieList!
  }
`;
