import React from 'react';
//import './Rank.css';

// simple component with no state so we don't need to make it a class
const Rank = ({name, entries}) => {
    return (
        <div>
            <div className='white f3'>
                {`${name}, your current entry count is....`}
            </div>
            <div className='white f1'>
                {entries}
            </div>
        </div>
      );
}

export default Rank; 