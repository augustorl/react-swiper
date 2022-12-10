import styles from '../styles/Home.module.css'
import s from '../styles/Swiper.module.css'

import { Swiper, useSwiper } from '@glitch-txs/react-swiper'

import { data } from '../data'
import Image from 'next/image'

import left from '../public/left.svg'
import right from '../public/right.svg'

export default function Home() {

  const { provider, handleNext, handlePrev } = useSwiper()
  
  return (
    <div className={styles.container}>
        {/* add clickable prop, and remove any pointer-event atribute in your slides CSS classes */}
        <Swiper provider={provider} clickable wrapperClass={s.container} containerClass={s.slideContainer}>

          {data?.map((item, index)=>(
            <div key={index} className={s.slide}>

              {/* add  draggable={false} to all you images inside the Swiper*/}
              <Image src={item.image} draggable={false} alt="" quality={100} />

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
    </div>
  )
}
