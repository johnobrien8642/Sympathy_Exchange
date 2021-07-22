import React from 'react';
import { useQuery } from '@apollo/client';

import Queries from '../../../../../graphql/queries.js';
import PostFormUtil from '../../functions/post_form_util.js';
const { FETCH_MATCHING_TAGS } = Queries;
const { handleFoundTag } = PostFormUtil;

const MatchedTagResults = ({
    query,
    tags,
    setTags, 
    tag,
    setTag, 
  }) => {
    
    let { error, data } = useQuery(FETCH_MATCHING_TAGS, {
      variables: {
        filter: query
      }
    })

    if (error) return `Error: ${error}`;

    const handleMatchedTagClassName = (data) => {
      if (data.fetchMatchingTags.length > 0) {
        return 'matchingTagsDD active'
      } else {
        return 'matchingTagsDD'
      }
    }

    if (data) {
      return (
        <ul
          className={handleMatchedTagClassName(data)}
        >
          <li>POPULAR</li>
          {data.fetchMatchingTags.map((tag, i) => {
            return (
              <li 
                key={i}
                onClick={e => {
                  handleFoundTag(
                    tag.title,
                    setTags, tags,
                    setTag, tag
                  )
                }}
              >
                {tag.title.slice(1, tag.title.length)}
              </li>
            )
          })}
        </ul>
      )
    } else {
      return (
        <ul
          className='noMatchingTags'
        >
        </ul>
      )
    }

}

export default MatchedTagResults;