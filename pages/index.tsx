import React, { useEffect, useState } from 'react';
import { Joystick } from 'react-joystick-component';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick';



export default function Home() {

  const notifySucces = () => toast.success('+1');
  const notifyError = () => toast.error('-1');


  const [direction, setDirection] = useState<any>('')
  const [Q, setQ] = useState<any>([])
  const [shuffled, setShuffled] = useState([])

  const [styleOnOne, setStyleOnOne] = useState('')
  const [styleOnTwo, setStyleOnTwo] = useState('')
  const [styleOnThree, setStyleOnThree] = useState('')
  const [styleOnFour, setStyleOnFour] = useState('')

  const [score, setScore] = useState(0)

  const effect = "text-blue-600 font-bold text-4xl"


  const getData = async () => {

    let temp: any;
    let temp_arr = []
    let temp_rand = getRandomInt(1,4)
    console.log(temp_rand);
    

    // const randomData1 = data[Math.floor(Math.random() * data.length)];
    // const randomData2 = data[Math.floor(Math.random() * data.length)];
    // const randomData3 = data[Math.floor(Math.random() * data.length)];
    // const randomData4 = data[Math.floor(Math.random() * data.length)];


    let { data: kotoba_score } = await supabase
    .from('kotoba_score')       
    .select('*').order("score",{ascending: true}).limit(1)
    console.log(kotoba_score![0].kotoba_id); 
    let q_id = parseInt(kotoba_score![0].kotoba_id)
    if (q_id < 50) {
      temp_arr = ([q_id, getRandomInt(q_id, q_id + 100),getRandomInt(q_id, q_id + 100),getRandomInt(q_id, q_id + 100)]);

    } else{
      temp_arr = ([q_id, getRandomInt(q_id - 50, q_id+100),getRandomInt(q_id - 50, q_id+100),getRandomInt(q_id - 50, q_id+100)]); 
    }

    let { data: kotoba, error } = await supabase
  .from('kotoba')
  .select("*")
  .in("id", randomArray(temp_arr))

  temp = kotoba![temp_rand -1]
  kotoba![temp_rand-1] = kotoba![0]
  kotoba![0] = temp
 
    console.log(kotoba);
     
    
  }

  function randomArray(arr:any[]){
    let r = getRandomInt(1,4)
    let temp = arr![r -1]
    arr![r-1] = arr![0]
    arr![0] = temp

    console.log(arr);
    
    return arr
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
      console.log(posts);
    };

    fetchData();

  }, [])

  const handleMove = (e: IJoystickUpdateEvent) => {
    setDirection(e.direction);
    console.log(e.direction);
    
   
  }

  const reset = () => {
    setStyleOnOne('')
    setStyleOnTwo('')
    setStyleOnThree('')
    setStyleOnFour('')
    getData()


  }

  const OK = () => {
    notifySucces()
    setScore(score + 1)
    reset()
  }

  const NG = () => {
    notifyError()
    setScore(score - 1)
    reset()
  }

  const handleStop = (e: IJoystickUpdateEvent) => {
    console.log(direction);

    // if (direction === 'FORWARD') {
    //   if (Q[shuffled[0]].no === Q[0].no) OK()
    //   else NG()
    // }
    // if (direction === 'RIGHT') {
    //   if (Q[shuffled[1]].no === Q[0].no) OK()
    //   else NG()
    // }
    // if (direction === 'BACKWARD') {
    //   if (Q[shuffled[2]].no === Q[0].no) OK()
    //   else NG()
    // }
    // if (direction === 'LEFT') {
    //   if (Q[shuffled[3]].no === Q[0].no) OK()
    //   else NG()
    // }
  }


  return (
    <main
    className={`flex min-h-screen flex-col items-center justify-between w-screen `}
  >
    <div className="flex flex-col items-center w-screen ">
      <div className=" flex place-items-center ">
        <div className="flex flex-col items-center">
          <a href={Q[0]?.link}>
            <h1 className="text-4xl font-bold text-center mt-20">{Q[0]?.kanji}</h1>
            <h2 className="text-2xl font-semibold text-center">{Q[0]?.reading}</h2>
          </a>
        </div>
      </div>

      <div className={`pt-20 text-xl ${styleOnOne}`} >
        {Q[shuffled[0]]?.definition}
      </div>
      <div className="flex flex-row items-center w-screen">
        <div className={`w-full  text-xl text-right ${styleOnTwo}`} >
          {Q[shuffled[3]]?.definition}
        </div>
        <div className='p-10 ' >
          <Joystick move={handleMove} stop={handleStop} />
        </div>
        <div className={`w-full  text-xl ${styleOnThree}`} >
          {Q[shuffled[1]]?.definition}
        </div>
      </div>
      <div className={` text-xl ${styleOnFour}`} >
        {Q[shuffled[2]]?.definition}
      </div>

      <div className="flex flex-col items-center w-screen">
        <h1 className="text-4xl font-bold text-center mt-20">Score: {score}</h1>
      </div>
    </div>
    <Toaster
      position="top-right"
      reverseOrder={true}
    />



  </main>

  );
}
