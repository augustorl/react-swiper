import styles from '../styles/Home.module.css'
import s from '../styles/Swiper.module.css'

import { Swiper, useSwiper } from '@glitch-txs/react-swiper'

import { data } from '../data'
import Image from 'next/image'

import left from '../public/left.svg'
import right from '../public/right.svg'
import { useEffect } from 'react'

export default function Home() {

  const { provider, handleNext, handlePrev, handleGoTo, autoStart, autoStop, inView } = useSwiper()

  useEffect(()=>{

    //the auto-slide will only be active when the component is in view.
    if(inView){
      //the argument taken by autoStart is the time in miliseconds for each slide. 
      autoStart(3000)
    } else {
      autoStop(3000)
    }

    //autoStart uses eventListeners so we need to pass the same params used when returning.
    return ()=> autoStop(3000)

  },[inView])
  
  return (
    <div className={styles.container}>

        <Swiper provider={provider} wrapperClass={s.container} containerClass={s.slideContainer}>

          {data?.map((item, index)=>(
            <div key={index} className={s.slide}>

                <Image src={item.image} alt="" quality={100} />

                <p className={s.textSlide} >
                    {item.text}
                </p>

            </div>
          ))}

        </Swiper>

        <div className={s.controlsContainer} >
            <button onClick={handlePrev}>
                <Image src={left} alt="" />
            </button>
            <button onClick={handleNext}>
                <Image src={right} alt="" />
            </button>
        </div>

        <div className={s.goToContainer}>
          <button onClick={()=>handleGoTo(0)}>
              Go To 0
          </button>
          <button onClick={()=>handleGoTo(1)}>
              Go To 1
          </button>
          <button onClick={()=>handleGoTo(2)}>
              Go To 2
          </button>
          <button onClick={()=>handleGoTo(3)}>
              Go To 3
          </button>
        </div>
    </div>
  )
}
