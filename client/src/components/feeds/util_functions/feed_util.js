
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
  filterChanged,
  tag,
  user,
  searchInput,
  isActivity
) => {
  return await client.query({
    query: query,
    variables: {
      fetchFeedInputs: {
        filter: filter,
        cursor: cursor,
        altCursor: altCursor,
        tagId: tag ? tag._id : null,
        userId: user ? user._id : null,
        searchInput: searchInput,
        activity: isActivity
      }
    },
    fetchPolicy: 'no-cache'
  }).then(res => {
    var newData, oldArr, newArr;
    
    // If the filter changed than we want to wipe everything
    // existing in the cache and have only fresh data

    if (filterChanged) {
      
      client.writeQuery({
        query: query,
        variables: {
          fetchFeedInputs: {
            filter: filter,
            cursor: cursor,
            altCursor: altCursor,
            tagId: tag ? tag._id : null,
            userId: user ? user._id : null,
            searchInput: searchInput,
            activity: isActivity
          }
        },
        data: {
          fetchFeed: [{ __typename: 'wipeCache'}, ...res.data.fetchFeed]
        }
      });

      return res.data.fetchFeed
    } else {

      // Otherwise add new data to existing data in the cache

      var readFeed = client.readQuery({
        query: query,
        variables: {
          fetchFeedInputs: {
            filter: filter,
            cursor: cursor,
            altCursor: altCursor,
            tagId: tag ? tag._id : null,
            userId: user ? user._id : null,
            searchInput: searchInput,
            activity: isActivity
          }
        }
      })

      if (readFeed) {
        var { fetchFeed } = readFeed;
      }

      if (fetchFeed) {
        oldArr = fetchFeed;
        newData = res.data.fetchFeed;
        newArr = [...oldArr, ...newData];
        
        client.writeQuery({
          query: query,
          variables: {
            fetchFeedInputs: {
              filter: filter,
              cursor: cursor,
              altCursor: altCursor,
              tagId: tag ? tag._id : null,
              userId: user ? user._id : null,
              searchInput: searchInput,
              activity: isActivity
            }
          },
          data: {
            fetchFeed: newArr
          }
        });
      }
    }
  })
};

const setCursor = (dataArr, cursorRef, activity, altCursorRef) => {
  if (dataArr?.length > 0) {
    let lastFromArr = dataArr[dataArr.length - 1];
    
    if (activity || lastFromArr.sympathyCount === 0) {
      cursorRef.current = 0;
      altCursorRef.current = lastFromArr._id;
    } else {
      let last = lastFromArr.sympathyCount.toString();
      cursorRef.current = parseFloat(last);
      altCursorRef.current = null;
    };
  };
  // return dataArr.length > 0 ? cursorRef.current = dataArr[dataArr.length - 1].sympathyCount.toString() : null;
};

const setFeed = (feedArrRef, dataArr) => {
  return feedArrRef.current = dataArr?.length > 0 ? [...feedArrRef.current, ...dataArr] : [];
};

const FeedUtil = {
  fetchMoreWithClient,
  setCursor,
  setFeed
};

export default FeedUtil;