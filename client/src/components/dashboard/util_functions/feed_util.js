
//There seems to be an unresolved issue with Apollo's fetchMore,
//which breaks when a user navigates away from the page and then back.
//Until this bug is resolved I use an instance of useApolloClient and
//just manually call the query with appropriate variables
const fetchMoreWithClient = async (
  client, 
  filter, 
  cursor, 
  altCursor,
  query, 
  filterChanged
) => {
  return await client.query({
    query: query,
    variables: {
      filter: filter,
      cursor: cursor,
      altCursor: altCursor
    },
    fetchPolicy: 'no-cache'
  }).then(res => {
    var newData, oldArr, newArr;
    
    if (filterChanged) {
      
      client.writeQuery({
        query: query,
        variables: {
          filter: filter,
          cursor: cursor,
          altCursor: altCursor
        },
        data: {
          fetchPleaFeed: res.data.fetchPleaFeed
        }
      });

      return res.data.fetchPleaFeed
    } else {
      var readFeed = client.readQuery({
        query: query,
        variables: {
          filter: filter,
          cursor: cursor,
          altCursor: altCursor
        }
      })

      if (readFeed) {
        var { fetchPleaFeed } = readFeed;
      }

      if (fetchPleaFeed) {
        oldArr = fetchPleaFeed;
        newData = res.data.fetchPleaFeed;
        newArr = [...oldArr, ...newData];
        
        client.writeQuery({
          query: query,
          variables: {
            filter: filter,
            cursor: cursor,
            altCursor: altCursor
          },
          data: {
            fetchPleaFeed: newArr
          }
        });
      }
    }
  })
};

const setCursor = (dataArr, cursorRef, altCursorRef) => {
  if (dataArr.length > 0) {
    let lastFromArr = dataArr[dataArr.length - 1];
  
    if (lastFromArr.sympathyCount === 0) {
      cursorRef.current = 0;
      altCursorRef.current = lastFromArr._id;
    } else {
      let last = lastFromArr.sympathyCount.toString();
      cursorRef.current = parseFloat(last);
      altCursorRef.current = null;
    }
  }
  // return dataArr.length > 0 ? cursorRef.current = dataArr[dataArr.length - 1].sympathyCount.toString() : null;
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