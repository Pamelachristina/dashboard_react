import React from 'react';
import { ClipLoader } from 'react-spinners';

const Spinner = () => (
  <div className="spinner">
    <ClipLoader size={50} color={"#123abc"} loading={true} />
  </div>
);

export default Spinner;
