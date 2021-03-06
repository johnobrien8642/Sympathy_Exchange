import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache,
          ApolloProvider, HttpLink } from '@apollo/client';
import { HashRouter } from 'react-router-dom';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

import App from './components/App';
import "bootstrap-icons/font/bootstrap-icons.css"
import './index.css';

import Queries from './graphql/queries'
import Mutations from './graphql/mutations'

const { IS_LOGGED_IN, CURRENT_USER_ID } = Queries;
const { VERIFY_USER } = Mutations;

const token = localStorage.getItem('auth-token');
const envURI = process.env.NODE_ENV === 'development' ? `http://localhost:4000/graphql` : process.env.APOLLO_URL

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    }
  }
});

const httpLink = new HttpLink({
  uri: envURI
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
  graphQLErrors.forEach(({ message, locations, path }) =>
    console.log(
      `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
    ),
  );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    addTypename: false,
    typePolicies: {
      UserType: {
        fields: {
          userFollows: {
            merge(existing = [], incoming = []) {
              return incoming
            }
          },
          tagFollows: {
            merge(existing = [], incoming = []) {
              return incoming
            }
          }
        }
      },
      Query: {
        fields: {
					user: {
						merge: (existing = [], incoming = []) => {
							return incoming
						}
					},
          fetchFeed: {
            keyArgs: false,
            merge: (existing = [], incoming = []) => {
              let arr;
              if (incoming[0]?.__typename === 'wipeCache') {
                let cleaned = incoming.slice(1);
                arr = [...cleaned];
              } else {
                arr = [...existing, ...incoming]
              }
              
              const elements = arr.reduce((array, current) => {
                return array.map(i => i.__ref).includes(current.__ref) ? array : [...array, current];
              }, []);
          
              return elements
            }
          },
          //  fetchLikesRepostsAndComments: {
          //     merge: (existing = [], incoming = []) => {
          //       return incoming
          //     }
          //   },
        // fetchTagFeed: {
        //   keyArgs: ['query'],
        //     merge: (existing = [], incoming = []) => {

        //     //post_form_util.js #updateCacheCreate and #updateCacheDelete,
        //     //object with __typename is added to the beginning of the array.
        //     //This tells merge function that we are adding or deleting a
        //     //post and would like the incoming array returned.
        //     if (incoming.length > 0 && "__typename" in incoming[0]) {
        //       return incoming.slice(1, incoming.length)
        //     } else {
        //       const elements = [...existing, ...incoming].reduce((array, current) => {
        //         return array.map(i => i.__ref).includes(current.__ref) ? array : [...array, current];
        //       }, []);
            
        //       return elements
        //     }
        //   }
        // },
        // fetchAllUserActivity: {
        //   keyArgs: ['query'],
        //     merge: (existing = [], incoming = []) => {
        //     //post_form_util.js #updateCacheCreate and #updateCacheDelete,
        //     //object with __typename is added to the beginning of the array.
        //     //This tells merge function that we are adding or deleting a
        //     //post and would like the incoming array returned.
        //     if (incoming.length > 0 && "__typename" in incoming[0]) {
        //       return incoming.slice(1, incoming.length)
        //     } else {
        //       const elements = [...existing, ...incoming].reduce((array, current) => {
        //         return array.map(i => i.__ref).includes(current.__ref) ? array : [...array, current];
        //       }, []);
            
        //       return elements
        //     }
        //   }
        // },
        // fetchUserFollowers: {
        //   keyArgs: ['query'],
        //     merge: (existing = [], incoming = []) => {
        //     //post_form_util.js #updateCacheCreate and #updateCacheDelete,
        //     //object with __typename is added to the beginning of the array.
        //     //This tells merge function that we are adding or deleting a
        //     //post and would like the incoming array returned.
        //     if (incoming.length > 0 && "__typename" in incoming[0]) {
        //       return incoming.slice(1, incoming.length)
        //     } else {
        //       const elements = [...existing, ...incoming].reduce((array, current) => {
        //         return array.map(i => i.__ref).includes(current.__ref) ? array : [...array, current];
        //       }, []);
            
        //       return elements
        //     }
        //   }
        // },
        // fetchFollowedUsers: {
        //   keyArgs: ['query'],
        //     merge: (existing = [], incoming = []) => {
        //     //post_form_util.js #updateCacheCreate and #updateCacheDelete,
        //     //object with __typename is added to the beginning of the array.
        //     //This tells merge function that we are adding or deleting a
        //     //post and would like the incoming array returned.
        //     if (incoming.length > 0 && "__typename" in incoming[0]) {
        //       return incoming.slice(1, incoming.length)
        //     } else {
        //       const elements = [...existing, ...incoming].reduce((array, current) => {
        //         return array.map(i => i.__ref).includes(current.__ref) ? array : [...array, current];
        //       }, []);
            
        //       return elements
        //     }
        //   }
        // },
        // fetchAllTagFeed: {
        //   keyArgs: ['query'],
        //     merge: (existing = [], incoming = []) => {
        //     //post_form_util.js #updateCacheCreate and #updateCacheDelete,
        //     //object with __typename is added to the beginning of the array.
        //     //This tells merge function that we are adding or deleting a
        //     //post and would like the incoming array returned.
        //     if (incoming.length > 0 && "__typename" in incoming[0]) {
        //       return incoming.slice(1, incoming.length)
        //     } else {
        //       const elements = [...existing, ...incoming].reduce((array, current) => {
        //         return array.map(i => i.__ref).includes(current.__ref) ? array : [...array, current];
        //       }, []);
            
        //       return elements
        //     }
        //   }
        // },
        // fetchCheckOutTheseBlogs: {
        //   merge: (existing = [], incoming = []) => {
        //     return incoming
        //   }
        // }
      }
    }
  }
  }),
  errorLink
})

client.writeQuery({
  query: IS_LOGGED_IN,
  data: {
    isLoggedIn: Boolean(token)
  }
})

if (token) {
  client
    .mutate({ mutation: VERIFY_USER, variables: { token } })
    .then(({ data }) => {
			const { _id, loggedIn } = data.verifyUser
			
			client.writeQuery({
				query: CURRENT_USER_ID,
				data: {
					currentUserId: _id
				}
			})

      client.writeQuery({
        query: IS_LOGGED_IN,
        data: {
          isLoggedIn: loggedIn
        }
      })
    })
}

const Root = () => {
  return (
    <ApolloProvider client={client}>
      <HashRouter>
        <App />
      </HashRouter>
    </ApolloProvider>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'));


