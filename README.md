# Important steps:

1. import Swiper component
2. import useSwiper hook
3. setup CSS files for the swiper component

## How to use:

Install npm package 

`npm i @glitch-txs/react-swiper`

import *Swiper* component and *useSwiper* hook:

`import { Swiper, useSwiper } from '@glitch/react-swiper'`

Set up the swiper, you will need to pass CSS classes to the swiper to be able to have full control on styling (wrapperClass and containerClass).

Here I'm using CSS modules:

```
export default function YourComponent() {

  const { provider, handleNext, handlePrev } = useSwiper()
  
  return (
    <div className={styles.container}>

        <Swiper provider={provider} wrapperClass={styles.wrapperClass} containerClass={styles.containerClass}>

            Your slides here...

        </Swiper>

        <div className={styles.controlsContainer} >
            <button onClick={handlePrev}>
                Left
            </button>

            <button onClick={handleNext}>
                Right
            </button>
        </div>

    </div>    
```

## Adding auto-slide:

```
  const { provider, handleNext, handlePrev, handleGoTo, autoStart, autoStop, inView } = useSwiper()

  useEffect(()=>{

    let animationTime = anyNumber

    //the auto-slide will only be active when the component is in view.
    if(inView){
      //the argument taken by autoStart is the time in miliseconds for each slide. 
      autoStart(animationTime)
    } else {
      autoStop(animationTime)
    }

    //autoStart uses eventListeners so we need to pass the same params used when returning.
    return ()=> autoStop(animationTime)

  },[inView])
```

## CSS files:

The Swiper component is built with two HTML Div's. One is the window (it will have overflow: hidden, so you will only see through it) that will wrap everything. 
And the child div that will be the container for all your slides, this one will be hidden by the most part.

```
.wrapperClass{
    /* the width and height must be equal to each slide individuly including their margins */
    width: 100%;
    max-width: 1000px;
    height: 250px;

    /* Needed overflow hidden - comment this line to see how the swiper works internaly */
    overflow: hidden;
}

.containerClass{
    /* Display flex will align the slides elements in one row */
    display: flex;

    /* Width is calculated multiplying the full width of the parent container by the number of slider elements inside the swiper,
    this way THIS container will take the width of the sum of all children elements. Width: calc(100% * numberOfCards) */

    /* Here the number for is because I'm using 4 cards */
    width: calc(100% * 4);
    height: 100%;

    z-index: 10;
}
```

Check GitHub examples for more information.



