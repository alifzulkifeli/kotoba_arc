import Card from '@/components/card';
import { supabase } from '@/utils/supabase';
import React, { useState, useEffect, useCallback } from 'react';


// Debounce function to delay execution of the search function
type AnyFunction = (...args: any[]) => void;

const debounce = <T extends AnyFunction>(func: T, delay: number): (...args: Parameters<T>) => void => {
    let timer: NodeJS.Timeout | undefined;

    return (...args: Parameters<T>) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => func(...args), delay);
    };
};

const Add: React.FC = () => {
    // Define state to hold the input value
    const [inputValue, setInputValue] = useState<string>('');
    const [wordMain, setWordMain] = useState<any>("");
    const [wordContain, setWordContain] = useState<any>([]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    // Search function to call the database or API
    const searchDatabase = async (query: any) => {
        // Replace this with your actual database/API call
        console.log('Searching for:', query);

        let { data: kotoba } = await supabase
            .from('kotoba')
            .select("*")
            // Filters
            .eq('kanji', query)
        setWordMain(kotoba);
        console.log(kotoba);


        let { data: kotoba2 } = await supabase
            .from('kotoba')
            .select("*")
            // Filters
            .ilike("kanji", "%" + query + "%").limit(5).order("id", {ascending:true})
        setWordContain(kotoba2);
        console.log(kotoba2);



    };

    // Create a debounced version of the search function
    const debouncedSearch = useCallback(
        debounce((query) => {
            if (query.trim() !== '') {
                searchDatabase(query);
            }
        }, 1000), // Delay of 500 milliseconds
        []
    );

    // useEffect hook to call debounced search function when inputValue changes
    useEffect(() => {
        debouncedSearch(inputValue);
    }, [inputValue, debouncedSearch]); // Dependency array watches for changes to inputValue

    return (
        <div className="flex justify-center items-center  text-white ">

            <div className="w-screen lg:px-40 lg:pt-60 px-10 pt-28">
                <input
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-inherit"
                    type="text"
                    value={inputValue} // Bind the input value to the state
                    onChange={handleChange} // Use handleChange to update the state
                />

                <div className='p-2' >
                    <Card data={wordMain} />
                </div>


           {/* Scrollable section */}
            <div className=" mt-4"> {/* Adjust max-h-80 as needed */}
                {wordContain.map((item: any, index: number) => (
                    <div key={index} className="px-2 pt-2 mx-1">
                        <Card data={[item]} />
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
};

export default Add;

