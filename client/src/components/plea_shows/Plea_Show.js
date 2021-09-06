import React from 'react';
import Chained from './Chained';
import NonChained from './Non_Chained';


const PleaShow = ({
  plea
}) => {

  if (plea.chained) {
    return <Chained plea={plea} />
  } else {
    return <NonChained plea={plea} />
  }
};

export default PleaShow;