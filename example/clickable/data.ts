import { StaticImageData } from 'next/image'
import img1 from './public/1.jpg'
import img2 from './public/2.jpg'
import img3 from './public/3.jpg'
import img4 from './public/4.jpg'

type Data = {
    image:StaticImageData,
    text: string
}

export const data: Data[] = [
    {image: img1, text: 'Price and other details may vary based on product size and color. THIS IS 0'},
    {image: img2, text: 'Price and other details may vary based on product size and color. THIS IS 1'},
    {image: img3, text: 'Price and other details may vary based on product size and color. THIS IS 2'},
    {image: img4, text: 'Price and other details may vary based on product size and color. THIS IS 3'},
]