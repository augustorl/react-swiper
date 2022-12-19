import React, { useEffect } from 'react'
import { Provider } from './types'

type Props = {
    provider: Provider,
    children: React.ReactNode,
    wrapperClass: string,
    containerClass: string,
    clickable?: boolean,
    progress?: JSX.Element
}

export const Swiper = ({ provider, children, wrapperClass, containerClass, clickable = false, progress = (<></>) }: Props) => {
    
    const transitionTime: number = provider.transitionTime

    //The number by which the width of the slide will be divided to decide where to move when dragging stops.
    const offsetPresition: number = 3

    const swiperRef = provider.swiperRef
    const containerRef = provider.containerRef
    const currentIndexDRef = provider.currentIndexDRef
    const transitionEndedRef = provider.transitionEndedRef
    const widthOffset: number = provider.widthOffset

    function getTranslateX(myElement: HTMLDivElement) {
        const style = window.getComputedStyle(myElement)
        const matrix = new WebKitCSSMatrix(style.transform)
        return matrix.m41
    }

    //Trigger when component is in View // Drraggable
    useEffect(()=>{

        let posX1: number;
        let posX2: number;

        provider.setInView(false)

        if(swiperRef.current && clickable){
            for (let i = 0; i < swiperRef.current.children.length; i++) {
                (swiperRef.current.children[i] as HTMLElement).style.pointerEvents = 'all';
            }
        }

        function dragMove(e:any) {
            if(swiperRef.current && containerRef.current){

            if(clickable)
            for (let i = 0; i < swiperRef.current.children.length; i++) {
                (swiperRef.current.children[i] as HTMLElement).style.pointerEvents = 'none';
            }

            containerRef.current.addEventListener('mouseleave', dragEnd)
            const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth

            if (e.type == "touchmove") {
                posX2 = posX1 - e.touches[0].clientX;
              } else {
                posX2 = posX1 - e.clientX;
              }

              const currentTranslateX = - Number(getTranslateX(swiperRef.current).toFixed(2))
            
              //prevent white space when going to far to the left else will move the slider while dragging
              if(currentTranslateX <= 0 || currentTranslateX >  (childWidth + widthOffset) * 2){
                return
              } else {
                swiperRef.current.style.transform = `translateX(${-posX2 - (childWidth + widthOffset)}px)`;
              }
            }
        }
          
        function dragEnd() {
            if(swiperRef.current && containerRef.current){

                if(clickable){
                    for (let i = 0; i < swiperRef.current.children.length; i++) {
                        (swiperRef.current.children[i] as HTMLElement).style.pointerEvents = 'all';
                    }
                }

                const translateOffset = Number(getTranslateX(swiperRef.current).toFixed(2))

                const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth
                if (translateOffset + (childWidth + widthOffset) < -1 * (childWidth + widthOffset) / offsetPresition && swiperRef.current && swiperRef.current.children.length > 0) {
                    //Go to Next slide

                    swiperRef.current.style.transform = `translateX(${-(childWidth + widthOffset)}px)`
            
                    const firstChild = swiperRef.current.children[0]
                    const secondtChild = swiperRef.current.children[1]
            
                    swiperRef.current.style.transition = `all ${transitionTime}ms ease-out`
            
                    swiperRef.current.style.transform = `translateX(${-(childWidth + widthOffset) * 2}px)`
            
                    const transition = ()=>{
                        if(swiperRef.current){
                            swiperRef.current.style.transition = `none`
                            swiperRef.current.style.transform = `translateX(0px)`
                            swiperRef.current.appendChild(firstChild)
                            swiperRef.current.appendChild(secondtChild)
            
                            transitionEndedRef.current = true
                            swiperRef.current.removeEventListener('transitionend', transition)
                        }
                    }
            
                    swiperRef.current.addEventListener('transitionend', transition)
                    if(currentIndexDRef.current == swiperRef.current.children.length - 1){
                        currentIndexDRef.current = 0
                        
                        if(provider.rerender)
                        provider.setCurrentIndex(0)
                    } else if (currentIndexDRef.current != null){
                        currentIndexDRef.current += 1
                        
                        if(provider.rerender)
                        provider.setCurrentIndex(currentIndexDRef.current)
                    }

                } else if (translateOffset + (childWidth + widthOffset) > (childWidth + widthOffset) / offsetPresition) {
                    //Go to Prev slide
                    swiperRef.current.style.transition = `all ${transitionTime}ms ease-out`
                    swiperRef.current.style.transform = `translateX(0px)`
                    const transition = ()=>{
                        if(swiperRef.current){
                            transitionEndedRef.current = true
                            swiperRef.current.removeEventListener('transitionend', transition)
                        }
                    }
            
                    swiperRef.current.addEventListener('transitionend', transition)
                    if(currentIndexDRef.current == 0){
                        currentIndexDRef.current = swiperRef.current.children.length - 1
                        
                        if(provider.rerender)
                        provider.setCurrentIndex(swiperRef.current.children.length - 1)
                    } else if (currentIndexDRef.current != null){
                        currentIndexDRef.current -= 1
                        
                        if(provider.rerender)
                        provider.setCurrentIndex(currentIndexDRef.current)
                    }
                } else {
                    //Stay in the current slide
                    const transition = ()=>{
                        if(swiperRef.current){
                            const firstChild = swiperRef.current.children[0]
                            swiperRef.current.style.transition = `none`
                            swiperRef.current.style.transform = `translateX(0px)`
                            swiperRef.current.appendChild(firstChild)
            
                            transitionEndedRef.current = true
                            swiperRef.current.removeEventListener('transitionend', transition)
                        }
                    }
                    //transition doesn't work if distance is 0 so:
                    if(translateOffset + (childWidth + widthOffset) == 0){
                        const firstChild = swiperRef.current.children[0]
                        swiperRef.current.style.transform = `translateX(0px)`
                        swiperRef.current.appendChild(firstChild)
                        transitionEndedRef.current = true
                    } else {
                        swiperRef.current.style.transition = `all ${transitionTime}ms ease-out`
                        swiperRef.current.style.transform = `translateX(${-(childWidth + widthOffset)}px)`
                        swiperRef.current.addEventListener('transitionend', transition)
                    }
                }
                containerRef.current.removeEventListener('mouseleave', dragEnd)

                containerRef.current.removeEventListener("touchmove", dragMove)
                containerRef.current.removeEventListener("mousemove", dragMove)
                containerRef.current.removeEventListener("touchend", dragEnd)
                containerRef.current.removeEventListener("mouseup", dragEnd)
            }
        }

        function dragStart(e:any) {
            if(containerRef.current && swiperRef.current && transitionEndedRef.current){
                transitionEndedRef.current = false
                swiperRef.current.style.transition = 'none'

                //Add prev image in case is dragedd to left
                const lastChildIndex = swiperRef.current.children.length - 1
            
                const childWidth = (swiperRef.current.children[0] as HTMLElement).offsetWidth
                
                const lastChild = swiperRef.current.children[lastChildIndex]
                swiperRef.current.insertBefore(lastChild, swiperRef.current.firstChild)

                swiperRef.current.style.transition = 'none'
                swiperRef.current.style.transform = `translateX(${-(childWidth + widthOffset)}px)`
                //

                if (e.type == "touchstart") {
                  posX1 = e.touches[0].clientX;

                  containerRef.current.addEventListener("touchmove", dragMove);
                  containerRef.current.addEventListener("touchend", dragEnd);
                } else {
                  posX1 = e.clientX;
              
                  containerRef.current.addEventListener("mouseup", dragEnd);
                  containerRef.current.addEventListener("mousemove", dragMove);
                }
            }            
        }

        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[])=>{
            if(entries[0].isIntersecting){
                if(containerRef.current){
                    containerRef.current.addEventListener("touchstart", dragStart);
                    containerRef.current.addEventListener("mousedown", dragStart);
                }
                provider.setInView(true)
            } else {
                if(containerRef.current){
                    containerRef.current.removeEventListener("touchstart", dragStart);
                    containerRef.current.removeEventListener("mousedown", dragStart);
                }
                provider.setInView(false)
                return
            }
        },{ threshold: 0.6, })

        if(containerRef.current)
        observer.observe(containerRef.current)

        return ()=> {
            if(containerRef.current){
                observer.unobserve(containerRef.current)
                containerRef.current.removeEventListener("touchstart", dragStart)
                containerRef.current.removeEventListener("mousedown", dragStart)
            }
        }
    },[])

  return (
    <>
        <div className={wrapperClass} ref={containerRef}>

            <div 
            className={containerClass} 
            ref={swiperRef}
            style={ provider.async && swiperRef.current ? { width:`calc( 100% * ${swiperRef.current.children.length})` } : { } } >

            { children }

            </div>
            { progress }
        </div>

    </>

  )
}