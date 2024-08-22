import React, { useEffect, useState } from 'react';
import { Joystick } from 'react-joystick-component';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '@/utils/supabase';
import { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';



export default function Home() {


  const [direction, setDirection] = useState<any>('')
  const [Q, setQ] = useState<any>([])
  const [A, setA] = useState<any>([])



  const [styleOnOne, setStyleOnOne] = useState('')
  const [styleOnTwo, setStyleOnTwo] = useState('')
  const [styleOnThree, setStyleOnThree] = useState('')
  const [styleOnFour, setStyleOnFour] = useState('')

  const [score, setScore] = useState(0)

  const effect = "text-blue-600 font-bold text-4xl"


  function getObjectWithLowestScoreMostly(arr: any) {
    // Sort the array by score in ascending order
    const sortedArr = arr.sort((a:any, b:any) => a.score - b.score); 
    
    // Get the object with the lowest score (first in sorted array)
    const lowestScoreObject = sortedArr[0];
    
    // Get the object with the highest score (last in sorted array)
    const highestScoreObject = sortedArr[sortedArr.length - 1];
    
    // Generate a random number between 0 and 1
    const randomValue = Math.random();
    
    // Return the highest score object 10% of the time, lowest score object 90% of the time
    console.log(randomValue < 0.1 ? highestScoreObject : lowestScoreObject);                
    
    // return randomValue < 0.1 ? highestScoreObject : lowestScoreObject;
  }



  const getData = async () => {
    let temp_arr = [];
    const r = getRandomInt(1, 4);


    // Fetch data from Supabase
    let { data: kotoba_score, error: scoreError } = await supabase
      .from('kotoba_score')
      .select('*')
      .order("score", { ascending: true })
      .limit(10);

    if (scoreError) {
      console.error("Error fetching kotoba_score:", scoreError);
      return;
    }

    if (kotoba_score?.length) {
      getObjectWithLowestScoreMostly(kotoba_score)
      let q_id = parseInt(kotoba_score[0].kotoba_id);
      setScore(parseInt(kotoba_score[0].score))

      if (q_id < 50) {
        temp_arr = [q_id, getRandomInt(q_id, q_id + 100), getRandomInt(q_id, q_id + 100), getRandomInt(q_id, q_id + 100)];
      } else {
        temp_arr = [q_id, getRandomInt(q_id - 50, q_id + 50), getRandomInt(q_id - 50, q_id + 50), getRandomInt(q_id - 50, q_id + 50)];
      }


      let temp = temp_arr[r - 1]
      temp_arr[r - 1] = temp_arr[0]
      temp_arr[0] = temp


      console.log(temp_arr);


      let { data: kotoba, error: kotobaError } = await supabase
        .from('kotoba')
        .select("*")
        .in("id", (temp_arr));

      if (kotobaError) {
        console.error("Error fetching kotoba:", kotobaError);
        return;
      }



      console.log(q_id);
      console.log(kotoba);


      if (kotoba && kotoba.length == 4) {
        kotoba.forEach(k => {
          if (k.id == q_id) {
            setA(k);
          }
        });

        setQ(kotoba);

      } else {
        console.warn("Kotoba array is either null or does not have enough elements. Kotoba length:", kotoba?.length, "Index (r):", r);
      }
    } else {
      console.warn("No kotoba_score data found");
    }
  }



  function getRandomInt(min: number, max: number): number {
    if (min > max) {
      throw new Error('Min must be less than or equal to max');
    }

    // Ensure the min and max are integers
    min = Math.ceil(min);
    max = Math.floor(max);

    // Generate a random integer between min (inclusive) and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
    const fetchData = async () => {
      const posts = await getData();
    };
    fetchData();
  }, [])

  const handleMove = (e: IJoystickUpdateEvent) => {
    setDirection(e.direction);
    // console.log(e.direction);

    if (direction === 'FORWARD') {
      setStyleOnOne("text-blue-400  font-extrabold animate-pulse ")
      setStyleOnTwo("")
      setStyleOnThree("")
      setStyleOnFour("")
    }
    else if (direction === 'RIGHT') {
      setStyleOnOne("")
      setStyleOnTwo("text-blue-400  font-extrabold animate-pulse ")
      setStyleOnThree("")
      setStyleOnFour("")
    }
    else if (direction === 'BACKWARD') {
      setStyleOnOne("")
      setStyleOnTwo("")
      setStyleOnThree("text-blue-400  font-extrabold animate-pulse ")
      setStyleOnFour("")
    }
    else if (direction === 'LEFT') {
      setStyleOnOne("")
      setStyleOnTwo("")
      setStyleOnThree("")
      setStyleOnFour("text-blue-400  font-extrabold animate-pulse ")
    }
    else {
      console.log(false);

    }
  }


  const handleStop = (e: IJoystickUpdateEvent) => {

    if (direction === 'FORWARD' && Q[0].id == A.id) {
      showResultAndCleanup(true)
    }
    else if (direction === 'RIGHT' && Q[1].id == A.id) {
      showResultAndCleanup(true)
    }
    else if (direction === 'BACKWARD' && Q[2].id == A.id) {
      showResultAndCleanup(true)
    }
    else if (direction === 'LEFT' && Q[3].id == A.id) {
      showResultAndCleanup(true)
    }
    else {
      showResultAndCleanup(false)

    }
  }

  const showResultAndCleanup = async (isCorrect: any) => {
    let timeoutsetting = 2000
    console.log(isCorrect);
    if (isCorrect) {
      toast.success("")
      timeoutsetting = 1000

      const { data, error } = await supabase
        .from('kotoba_score')
        .update({ score: score + 10 })
        .eq('kotoba_id', A.id)
        .select()
    } else {
      toast.error(`${A.kanji}`)
      const { data, error } = await supabase
      .from('kotoba_score')
      .update({ score: score - 5 })
      .eq('kotoba_id', A.id)
      .select()
    }

    setTimeout(() => {
      setStyleOnOne('')
      setStyleOnTwo('')
      setStyleOnThree('')
      setStyleOnFour('')
      getData()
    }, timeoutsetting);


  }


  return (
    <main className={`flex min-h-screen flex-col items-center justify-between w-screen`}>
      {Q &&
        <div className="flex flex-col items-center w-screen h-screen">
          <div className='flex flex-col h-full items-center justify-center w-full'>
            <h1 className="text-4xl font-bold text-center ">{A.meaning}</h1>


            <div className="flex flex-col items-center">
              <div className={`pt-10 text-xl text-center w-full ${styleOnOne}`}>
                {Q[0]?.kanji}
                <p className='text-[10px] '>{Q[0]?.kana}</p>
              </div>
              <div className="flex flex-row items-center justify-center w-full">
                <div className={`w-1/3 text-xl text-right ${styleOnFour}`}>
                  {Q[3]?.kanji}
                  <p className='text-[10px] w-28'>{Q[3]?.kana}</p>
                </div>
                <div className='p-10'>
                  <Joystick move={handleMove} stop={handleStop} baseColor="#023047" stickColor='#8ecae6' size={70} />
                </div>
                <div className={`w-1/3 text-xl  ${styleOnTwo}`}>
                  {Q[1]?.kanji}
                  <p className='text-[10px] w-28'>{Q[1]?.kana}</p>
                </div>
              </div>
              <div className={`text-xl text-center ${styleOnThree}`}>
                {Q[2]?.kanji}
                <p className='text-[10px]'>{Q[2]?.kana}</p>
              </div>
            </div>
          </div>
        </div>
      }
      <Toaster position="top-right" reverseOrder={true} />
    </main>

  );
}
