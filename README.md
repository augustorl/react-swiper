# Important steps:

1. import Swiper component
2. import useSwiper hook
3. setup CSS files for the swiper component

[NPM URL](https://www.npmjs.com/package/@glitch-txs/react-swiper)

## How to use:

Install npm package 

```bash
npm i @glitch-txs/react-swiper
```

import *Swiper* component and *useSwiper* hook:

```tsx
import { Swiper, useSwiper } from '@glitch-txs/react-swiper'
```

Set up the swiper, you will need to pass CSS classes to the swiper to be able to have full control on styling (wrapperClass and containerClass).

Here I'm using CSS modules:

```tsx
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
## Clickable

If you want to have clickable components inside the swiper use the prop `clickable`.

If you are using images remember to add the prop `draggable={false}`

```tsx
        <Swiper provider={provider} clickable wrapperClass={styles.wrapperClass} containerClass={styles.containerClass}>

          <Image src='mySrc' draggable={false} alt='myImg' />

        </Swiper>
```

## Adding auto-slide:

```tsx
  const { provider, handleNext, handlePrev, handleGoTo, autoStart, autoStop, inView } = useSwiper()

  useEffect(()=>{

    //the auto-slide will only be active when the component is in view.
    if(inView){
      //the argument taken by autoStart is the time in miliseconds for each slide. 
      autoStart()
    } else {
      autoStop()
    }

    //autoStart uses eventListeners so we need to pass the same params used when returning.
    return ()=> autoStop()

  },[inView])
```

## CSS files:

The Swiper component is built with two HTML Div's. One is the window (it will have overflow: hidden, so you will only see through it) that will wrap everything. 
And the child div that will be the container for all your slides, this one will be hidden by the most part.

```css
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

    /* Here there's number four because I'm using 4 cards */
    width: calc(100% * 4);
    height: 100%;

    z-index: 10;
}
```

## Progress Points/bars

if you want to add a fixed component INSIDE the swiper you can pass a JSX variable to the component as *progress*

## Hooks functions and variables

- provider
- handleNext
- handlePrev
- handleGoTo
- autoStart
- autoStop
- inView
- currentIndex

# useSwiper arguments (Not Mandatory)

useSwiper hook takes an object as arguments with the following vaiables:

`rerender: default = true`, (This will render the whole component each time the currentIndex changes, you can turn this off if you're not using curentIndex variable)

`widthOffset: default = 0`, ( margin of the sliders if any. E.g: `margin: 0 5px 0 5px`  ==> `widthOffset = 10` )

`transitionTime: default = 300` (The time in miliseconds it takes to slide)

`animationTime: default = 4000` (The time in miliseconds it will automatically move to the next slide)

`async: default = false` (if contenct is async set this to true and add a conditional for the Swipper component to render, you won't need to add width to the containerClass in this case.)

example:


```tsx
export default function YourComponent() {

  const { provider } = useSwiper({ async: true })

  const [isData, setIsData] = useState<boolean>(false)

  useEffect(()=>{
    setIsData(true)
  },[isData])

  
  return (

    {
      isData && <Swiper provider={provider} wrapperClass={s.container} containerClass={s.slideContainer}>

        { data?.map((item, index)=>(
            <div key={index} className={s.slide}>

                Content Here

            </div>
        ))}

      </Swiper>
    }

  )
}
```
All functions must be disabled until the content is loaded.

GitHub examples are currently outdated.


