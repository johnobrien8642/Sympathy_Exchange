import React from 'react';
import { Link, useHistory } from 'react-router-dom';

const ActivityShow = ({
  activity,
  fetchMoreBoolRef
}) => {
  const { kind } = activity;
  const isSave = kind === 'Save';
  const isSympathy = kind === 'Sympathy';
  const isFollow = kind === 'Follow';
  const history = useHistory();

  if (isSave) {
    return (
      <div
        className='activity'
      >
        <span>
          <button
            // to={`/user-feed/${activity.user._id}`}
            onClick={e => {
              e.preventDefault();
              history.push(`/user-feed/${activity.user._id}`);
            }}
          >
            {activity.user.username}
          </button>
        </span>
        <span>saved your</span>
        <span>
          <Link
            to={`/plea/${activity.plea._id}`}
          >
            plea
          </Link>
        </span>
        <span>This long ago</span>
      </div>
    )
  } else if (isSympathy) {
    return (
      <div
        className='activity'
      >
        <span>
          <Link
            to={`/user-feed/${activity.user._id}`}
          >
            {activity.user.username}
          </Link>
        </span>
        <span>sympathized with your</span>
        <span>
          <Link
            to={`/plea/${activity.plea._id}`}
          >
            plea
          </Link>
        </span>
        <span>This long ago</span>
      </div>
    )
  } else if (isFollow) {
    return (
      <div
        className='activity'
      >
        <span>
          <Link
            to={`/user-feed/${activity.user._id}`}
          >
            {activity.user.username}
          </Link>
        </span>
        <span>followed you</span>
        <span>This long ago</span>
      </div>
    )
  };
};

export default ActivityShow;