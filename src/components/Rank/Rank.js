import React from 'react';
//import './Rank.css';

// simple component with no state so we don't need to make it a class
const Rank = () => {

    return (
        <div>
            <div className='white f3'>
                {'Your current rank is....'}
            </div>
            <div className='white f1'>
                {'#1'}
            </div>
        </div>
      );
}

export default Rank; 