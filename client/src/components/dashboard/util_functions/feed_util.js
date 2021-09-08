
//There seems to be an unresolved issue with Apollo's fetchMore,
//which breaks when a user navigates away from the page and then back.
//Until this bug is resolved I use an instance of useApolloClient and
//just manually call the query with appropriate variables
const fetchMoreWithClient = async (client, filter, cursor, query) => {
  await client.query({
    query: query,
    variables: {
      filter: filter,
      cursor: cursor
    },
    fetchPolicy: 'no-cache'
  }).then(res => {
    var readFeed = client.readQuery({
      query: query,
      variables: {
        filter: filter,
        cursor: cursor
      }
    })

    if (readFeed) {
      var { fetchPleaFeed } = readFeed;
    }
    
    var newData, oldArr, newArr
    if (fetchPleaFeed) {
      oldArr = fetchPleaFeed;
      newData = res.data.fetchPleaFeed;
      newArr = [...oldArr, ...newData];
      
      client.writeQuery({
        query: query,
        variables: {
          filter: filter,
          cursor: cursor
        },
        data: {
          fetchPleaFeed: newArr
        }
      })
    }
  })
};

const setCursor = (dataArr, cursorRef) => {
  return dataArr.length > 0 ? cursorRef.current = dataArr[dataArr.length - 1].sympathyCount : null;
};

const setFeed = (feedArrRef, dataArr) => {
  return feedArrRef.current = dataArr.length > 0 ? [...feedArrRef.current, ...dataArr] : [];
};

const FeedUtil = {
  fetchMoreWithClient,
  setCursor,
  setFeed
};

export default FeedUtil;