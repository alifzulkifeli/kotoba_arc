import React from 'react';


// Define the props type
interface CardProps {
    data: any;
}

// Define the functional component with typed props
const Card: React.FC<CardProps> = ({ data }) => {
    data = data[0]
    
    return ( 
        <div >
            { data &&
                    <div className='border-solid border-2 border-sky-500 p-2 rounded-xl' >
                    <p className=' text-[10px]  leading-none' >{data.kana}</p>
                    <p>{data.kanji}</p>
                    <p className=' text-sm ' >{data.meaning}</p>
                </div>
            }
        </div>
    );
};

export default Card;
