import React from 'react';
import Header from './Header';
import ElectionButtons from '../components/ElectionButtons';
const MultiLayout = () => {


  return (
    <React.Fragment>
        <Header/>
            <div className='main-container'>
                <ElectionButtons/>
            </div>
    </React.Fragment>
  );
};

export default MultiLayout;
