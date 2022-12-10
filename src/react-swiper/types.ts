import { MutableRefObject } from "react"

export type Provider = {
    swiperRef: MutableRefObject<HTMLDivElement | null>,
    containerRef: MutableRefObject<HTMLDivElement | null>,
    currentIndexDRef: MutableRefObject<number | null>,
    transitionEndedRef: MutableRefObject<boolean | null>,
    transitionTime: number,
    widthOffset: number,

    handleNext: ()=> void,
    setInView: (inView: boolean)=> void,
}