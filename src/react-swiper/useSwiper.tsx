import { useRef, useState } from 'react'
import { Provider } from './types'

export const useSwiper = (transitionTime: number = 300, widthOffset: number = 0) => {
    
    const swiperRef = useRef<HTMLDivElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const intervalIDRef = useRef<NodeJS.Timer | null>(null)
    const currentIndexDRef = useRef<number>(0)
    const transitionEndedRef = useRef<boolean>(true)

    const [inView, setInView] = useState<boolean>(false)

    const handleNext = ()=>{

        if(swiperRef.current && swiperRef.current.children.length > 0 && transitionEndedRef.current){

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
                    } else {
                        currentIndexDRef.current += 1
                    }
                    transitionEndedRef.current = true
                }
            }

            swiperRef.current.addEventListener('transitionend', transition)
        }
    }

    const handlePrev = ()=>{
        
        if(swiperRef.current && swiperRef.current.children.length > 0 && transitionEndedRef.current){

            transitionEndedRef.current = false

            const lastChildIndex = swiperRef.current.children.length - 1
            
            const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth
            
            const lastChild = swiperRef.current.children[lastChildIndex]

            swiperRef.current.insertBefore(lastChild, swiperRef.current.firstChild)

            swiperRef.current.style.transition = 'none'
            swiperRef.current.style.transform = `translateX(-${(childWidth + widthOffset)}px)`

            setTimeout(()=>{
                if(swiperRef.current){
                    swiperRef.current.style.transition = `all ${transitionTime}ms ease-out`
                    swiperRef.current.style.transform = `translateX(0px)`
                }
            },0)

            const transition = ()=>{
                if(swiperRef.current){
                    transitionEndedRef.current = true
                    swiperRef.current.removeEventListener('transitionend', transition)
                }
            }

            swiperRef.current.addEventListener('transitionend', transition)

            if(currentIndexDRef.current == 0){
                currentIndexDRef.current = swiperRef.current.children.length - 1
            } else {
                currentIndexDRef.current -= 1
            }
        }
        
    }

    const handleGoTo = (index: number)=>{

        if(currentIndexDRef.current == index && transitionEndedRef.current){
            return
        }else if(currentIndexDRef.current < index && transitionEndedRef.current){
        //Goes fordward
            if(swiperRef.current && swiperRef.current.children.length > 0){

                transitionEndedRef.current = false

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
                        transitionEndedRef.current = true
                    }
                }

                swiperRef.current.addEventListener('transitionend', transition)
            }
        }else if(currentIndexDRef.current > index && transitionEndedRef.current){
        //Goes backward
            if(swiperRef.current && swiperRef.current.children.length > 0){

                transitionEndedRef.current = false

                const IndexDif = currentIndexDRef.current - index

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
                        swiperRef.current.style.transition = `all ${transitionTime}ms ease-out`
                        swiperRef.current.style.transform = `translateX(0px)`
                        transitionEndedRef.current = true
                    }
                },0)
                currentIndexDRef.current = index
            }
        }

    }

    const autoStart = (animationTime: number)=>{

        if(intervalIDRef.current){
            clearInterval(intervalIDRef.current)
        }

        intervalIDRef.current = setInterval(()=>{
            provider.handleNext()
        }, animationTime)
        
        //This will stop the animation if the window get blur to stop the animation when the user is not in the website. (Avoids Bugs).
        window.addEventListener('blur', ()=>{
            if(intervalIDRef.current)
            clearInterval(intervalIDRef.current)
        })

        window.addEventListener('focus', ()=>{
            if(intervalIDRef.current)
            clearInterval(intervalIDRef.current)
            intervalIDRef.current = setInterval(()=>{
                provider.handleNext()
            }, animationTime)
        })

    }

    const autoStop = (animationTime: number)=>{
        if(intervalIDRef.current){
            clearInterval(intervalIDRef.current)
        }
        
        window.removeEventListener('blur', ()=>{
            if(intervalIDRef.current)
            clearInterval(intervalIDRef.current)
        })
        window.removeEventListener('focus', ()=>{
            if(intervalIDRef.current)
            clearInterval(intervalIDRef.current)
            intervalIDRef.current = setInterval(()=>{
                provider.handleNext()
            }, animationTime)
        })
    }

    const provider: Provider = {
        swiperRef,
        containerRef,
        currentIndexDRef,
        transitionEndedRef,
        transitionTime,
        widthOffset,
        handleNext,
        setInView
    }

  return { provider, handleNext, handlePrev, handleGoTo, autoStart, autoStop, inView, currentIndexDRef }
}