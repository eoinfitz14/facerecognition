import React from 'react';

// simple component with no state so we don't need to make it a class
const FaceRecognition = ({ imageUrl }) => {

    return (
        <div className='center ma'>
            <div className= 'absolute mt2'>
                <img alt='' src={imageUrl} width='500px' height='auto' />
            </div>
        </div>
    );
}

export default FaceRecognition; 