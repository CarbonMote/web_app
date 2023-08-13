import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/37655/carbonmote_721/version/latest",
  cache: new InMemoryCache()
});

export default client;
