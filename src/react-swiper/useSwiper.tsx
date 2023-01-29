import { useRef, useState } from 'react'
import { Provider } from './types'

export const useSwiper = ( {rerender = true, widthOffset = 0, transitionTime = 300, animationTime = 4000, async = false} = {} ) => {
    
    const swiperRef = useRef<HTMLDivElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const intervalIDRef = useRef<NodeJS.Timer | null>(null)
    const currentIndexDRef = useRef<number>(0)
    const transitionEndedRef = useRef<boolean>(true)
    
    const isAutoSlideRef = useRef<boolean>(false)

    const [inView, setInView] = useState<boolean>(false)
    const [currentIndex, setCurrentIndex] = useState<number>(0)

    const handleClearInterval = ()=>{
        if(intervalIDRef.current){
            clearInterval(intervalIDRef.current)
        }
    }

    const handleStartInterval = ()=>{
        if(intervalIDRef.current){
            clearInterval(intervalIDRef.current)
        }

        handleNext()
    }

    const handleNext = ()=>{

        if(swiperRef.current && swiperRef.current.children.length > 0 && transitionEndedRef.current){

            //we'll restart the counter for the autoslide
            if(intervalIDRef.current && isAutoSlideRef.current){
                clearInterval(intervalIDRef.current)
            }
            
            transitionEndedRef.current = false

            const firstChild = swiperRef.current.children[0]

            swiperRef.current.style.transition = `all ${transitionTime}ms ease-out`

            const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth

            swiperRef.current.style.transform = `translateX(-${(childWidth + widthOffset)}px)`

            const transition = ()=>{
                if(swiperRef.current){
                    swiperRef.current.style.transition = `none`
                    swiperRef.current.style.transform = `translateX(0px)`
                    swiperRef.current.appendChild(firstChild)

                    swiperRef.current.removeEventListener('transitionend', transition)

                    if(currentIndexDRef.current == swiperRef.current.children.length - 1){
                        currentIndexDRef.current = 0

                        if(rerender)
                        setCurrentIndex(0)
                    } else {
                        currentIndexDRef.current += 1

                        if(rerender)
                        setCurrentIndex(prev => prev + 1)
                    }

                    if(isAutoSlideRef.current){
                        intervalIDRef.current = setInterval(()=>{
                            handleNext()
                        }, animationTime)
                    }
                    
                    transitionEndedRef.current = true
                }
            }

            swiperRef.current.addEventListener('transitionend', transition)
        }
    }

    const handlePrev = ()=>{
        
        if(swiperRef.current && swiperRef.current.children.length > 0 && transitionEndedRef.current){

            //we'll restart the counter for the autoslide
            if(intervalIDRef.current && isAutoSlideRef.current){
                clearInterval(intervalIDRef.current)
            }

            transitionEndedRef.current = false

            const lastChildIndex = swiperRef.current.children.length - 1
            
            const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth
            
            const lastChild = swiperRef.current.children[lastChildIndex]

            swiperRef.current.insertBefore(lastChild, swiperRef.current.firstChild)

            swiperRef.current.style.transition = 'none'
            swiperRef.current.style.transform = `translateX(-${(childWidth + widthOffset)}px)`

            const transition = ()=>{
                if(swiperRef.current){

                    if(isAutoSlideRef.current){
                        intervalIDRef.current = setInterval(()=>{
                            handleNext()
                        }, animationTime)
                    }

                    transitionEndedRef.current = true
                    swiperRef.current.removeEventListener('transitionend', transition)
                }
            }

            setTimeout(()=>{
                if(swiperRef.current){
                    swiperRef.current.style.transition = `all ${transitionTime}ms ease-out`
                    swiperRef.current.style.transform = `translateX(0px)`
                    swiperRef.current.addEventListener('transitionend', transition)
                }
            },10)

            if(currentIndexDRef.current == 0){
                currentIndexDRef.current = swiperRef.current.children.length - 1

                if(rerender)
                setCurrentIndex(swiperRef.current.children.length - 1)
            } else {
                currentIndexDRef.current -= 1
                
                if(rerender)
                setCurrentIndex(prev => prev - 1)
            }
        }
        
    }

    const handleGoTo = (index: number)=>{

        if(currentIndexDRef.current == index && transitionEndedRef.current){
            //we'll restart the counter for the autoslide
            if(intervalIDRef.current && isAutoSlideRef.current){
                transitionEndedRef.current = false
                clearInterval(intervalIDRef.current)

                intervalIDRef.current = setInterval(()=>{
                    handleNext()
                }, animationTime)
                transitionEndedRef.current = true
            }
            return
        }else if(currentIndexDRef.current < index && transitionEndedRef.current && swiperRef.current){

        //Goes fordward
                transitionEndedRef.current = false
                
                //we'll restart the counter for the autoslide
                if(intervalIDRef.current && isAutoSlideRef.current){
                    clearInterval(intervalIDRef.current)
                }

                const IndexDif = index - currentIndexDRef.current

                swiperRef.current.style.transition = `all ${transitionTime}ms ease-out`

                const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth

                swiperRef.current.style.transform = `translateX(-${(childWidth + widthOffset) * (IndexDif)}px)`

                const transition = ()=>{
                    if(swiperRef.current){
                        swiperRef.current.style.transition = `none`
                        swiperRef.current.style.transform = `translateX(0px)`
                        for(let i = 0; i < IndexDif; i++){
                            const firstChild = swiperRef.current.children[0]
                            swiperRef.current.appendChild(firstChild)
                        }

                        swiperRef.current.removeEventListener('transitionend', transition)
                        currentIndexDRef.current = index
                        
                        if(rerender)
                        setCurrentIndex(index)

                        if(isAutoSlideRef.current){
                            intervalIDRef.current = setInterval(()=>{
                                handleNext()
                            }, animationTime)
                        }

                        transitionEndedRef.current = true
                    }
                }

                swiperRef.current.addEventListener('transitionend', transition)

        }else if(currentIndexDRef.current > index && transitionEndedRef.current && swiperRef.current){
        //Goes backward
                transitionEndedRef.current = false

                //we'll restart the counter for the autoslide
                if(intervalIDRef.current && isAutoSlideRef.current){
                    clearInterval(intervalIDRef.current)
                }

                const IndexDif = currentIndexDRef.current - index

                const lastChildIndex = swiperRef.current.children.length - 1
                
                const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth
                
                for(let i = 0; i < IndexDif; i++){
                    const lastChild = swiperRef.current.children[lastChildIndex]
                    swiperRef.current.insertBefore(lastChild, swiperRef.current.firstChild)
                }

                swiperRef.current.style.transition = 'none'
                swiperRef.current.style.transform = `translateX(-${(childWidth + widthOffset) * IndexDif}px)`

                const transition = ()=>{
                    if(swiperRef.current){

                        if(isAutoSlideRef.current){
                            intervalIDRef.current = setInterval(()=>{
                                handleNext()
                            }, animationTime)
                        }

                        transitionEndedRef.current = true
                        swiperRef.current.removeEventListener('transitionend', transition)
                    }
                }

                setTimeout(()=>{
                    if(swiperRef.current){
                        swiperRef.current.style.transition = `all ${transitionTime}ms ease-out`
                        swiperRef.current.style.transform = `translateX(0px)`
                        swiperRef.current.addEventListener('transitionend', transition)
                    }
                },10)

                currentIndexDRef.current = index
                
                if(rerender)
                setCurrentIndex(index)
        }

    }

    const handleRestart = ()=>{

        if(currentIndexDRef.current == 0 && transitionEndedRef.current){
            //we'll restart the counter for the autoslide
            if(intervalIDRef.current && isAutoSlideRef.current){
                transitionEndedRef.current = false
                clearInterval(intervalIDRef.current)

                intervalIDRef.current = setInterval(()=>{
                    handleNext()
                }, animationTime)
                transitionEndedRef.current = true
            }
            return
        }else if(currentIndexDRef.current < 0 && transitionEndedRef.current && swiperRef.current){

        //Goes fordward
                transitionEndedRef.current = false
                
                //we'll restart the counter for the autoslide
                if(intervalIDRef.current && isAutoSlideRef.current){
                    clearInterval(intervalIDRef.current)
                }

                const IndexDif = 0 - currentIndexDRef.current

                swiperRef.current.style.transition = `all 0ms ease-out`

                const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth

                swiperRef.current.style.transform = `translateX(-${(childWidth + widthOffset) * (IndexDif)}px)`

                const transition = ()=>{
                    if(swiperRef.current){
                        swiperRef.current.style.transition = `none`
                        swiperRef.current.style.transform = `translateX(0px)`
                        for(let i = 0; i < IndexDif; i++){
                            const firstChild = swiperRef.current.children[0]
                            swiperRef.current.appendChild(firstChild)
                        }
                        currentIndexDRef.current = 0
                        
                        if(rerender)
                        setCurrentIndex(0)

                        if(isAutoSlideRef.current){
                            intervalIDRef.current = setInterval(()=>{
                                handleNext()
                            }, animationTime)
                        }

                        transitionEndedRef.current = true
                    }
                }

                setTimeout(transition,0)

        }else if(currentIndexDRef.current > 0 && transitionEndedRef.current && swiperRef.current){
        //Goes backward
                transitionEndedRef.current = false

                //we'll restart the counter for the autoslide
                if(intervalIDRef.current && isAutoSlideRef.current){
                    clearInterval(intervalIDRef.current)
                }

                const IndexDif = currentIndexDRef.current - 0

                const lastChildIndex = swiperRef.current.children.length - 1
                
                const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth
                
                for(let i = 0; i < IndexDif; i++){
                    const lastChild = swiperRef.current.children[lastChildIndex]
                    swiperRef.current.insertBefore(lastChild, swiperRef.current.firstChild)
                }

                swiperRef.current.style.transition = 'none'
                swiperRef.current.style.transform = `translateX(-${(childWidth + widthOffset) * IndexDif}px)`

                setTimeout(()=>{
                    if(swiperRef.current){
                        swiperRef.current.style.transition = `all 0ms ease-out`
                        swiperRef.current.style.transform = `translateX(0px)`
                        if(isAutoSlideRef.current){
                            intervalIDRef.current = setInterval(()=>{
                                handleNext()
                            }, animationTime)
                        }

                        transitionEndedRef.current = true
                    }
                },10)

                currentIndexDRef.current = 0
                
                if(rerender)
                setCurrentIndex(0)
        }

    }

    const autoStart = ()=>{

        if(intervalIDRef.current){
            clearInterval(intervalIDRef.current)
        }

        isAutoSlideRef.current = true

        intervalIDRef.current = setInterval(handleStartInterval, animationTime)
        
        //This will stop the animation if the window get blur to stop the animation when the user is not in the website. (Avoids Bugs).
        window.addEventListener('blur', handleClearInterval)

        window.addEventListener('focus', handleStartInterval)

    }

    const autoStop = ()=>{
        if(intervalIDRef.current){
            clearInterval(intervalIDRef.current)
        }
        
        isAutoSlideRef.current = false
        
        window.removeEventListener('blur', handleClearInterval)
        window.removeEventListener('focus', handleStartInterval)
    }

    const provider: Provider = {
        swiperRef,
        containerRef,
        currentIndexDRef,
        transitionEndedRef,
        transitionTime,
        widthOffset,
        rerender,
        async,
        intervalIDRef,
        isAutoSlideRef,
        animationTime,
        handleNext,
        setInView,
        setCurrentIndex
    }

  return { provider, handleNext, handlePrev, handleGoTo, autoStart, autoStop, handleRestart, inView, currentIndex }
}