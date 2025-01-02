import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { IS_CLIENT } from "../config/common";
import { ACCESS_TOKEN } from "../config/app";
const authLink = setContext((_, { headers }) => {
  let accessToken = IS_CLIENT && window.localStorage.getItem(ACCESS_TOKEN);
  console.log('token', accessToken);
  return {
    headers: {
      ...headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : null,
      "x-hasura-admin-secret": "myadminsecretkey",
    },
  };
});

const httpLink = new HttpLink({
  uri: "http://52.74.41.188:8080/v1/graphql",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ extensions }) => {
      if (
        extensions.code === "invalid-headers" ||
        extensions.code === "invalid-jwt"
      ) {
        window.location.assign(`${window.location.origin}/login`);
      }
    });
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    alert("network connection problem");
  }
});
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://52.74.41.188:8080/v1/graphql",
    shouldRetry: () => true,
    retryAttempts: 5,
    connectionParams: async () => {
      let accessToken = IS_CLIENT && window.localStorage.getItem(ACCESS_TOKEN);
      console.log('token: ',accessToken)
      return {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : null,
          "x-hasura-admin-secret": "myadminsecretkey",
        },
      };
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink).concat(splitLink),
  // link: splitLink,
  cache: new InMemoryCache(),
  ssrMode: typeof window === "undefined",
});