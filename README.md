# Important steps:

1. Swiper component
2. useSwiper hook
3. CSS file for the swiper

## How to use:

Install npm package 

`npm i @glitch-txs/react-swiper`

import Swiper component and useSwiper hook:

`import { Swiper, useSwiper } from 'npm i @glitch/react-swiper'`

Set up the swiper, you will need to pass CSS classes to the swiper to be able to have full control on styling (wrapperClass and containerClass).

```
export default function YourComponent() {

  const { provider, handleNext, handlePrev } = useSwiper()
  
  return (
    <div className={styles.container}>

        <Swiper provider={provider} wrapperClass={s.container} containerClass={s.slideContainer}>

            Your slides here...

        </Swiper>

        <div className={s.controlsContainer} >
            <button onClick={handlePrev}>
                Left
            </button>

            <button onClick={handleNext}>
                Right
            </button>
        </div>

    </div>    
```

The Swiper component is built with two HTML Div's. One is the window (it will have overflow: hidden, so you will only see through it) that will wrap everything. 
And the child div that will be the container for all your slides, this one will be hidden by the most part.

Check GitHub examples for more information.



