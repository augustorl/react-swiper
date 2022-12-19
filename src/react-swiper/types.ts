import { MutableRefObject } from "react"

export type Provider = {
    swiperRef: MutableRefObject<HTMLDivElement | null>,
    containerRef: MutableRefObject<HTMLDivElement | null>,
    currentIndexDRef: MutableRefObject<number | null>,
    transitionEndedRef: MutableRefObject<boolean | null>,
    transitionTime: number,
    widthOffset: number,
    rerender: boolean,
    async: boolean,

    handleNext: ()=> void,
    setInView: (inView: boolean)=> void,
    setCurrentIndex: (currentIndex: number)=> void,
}