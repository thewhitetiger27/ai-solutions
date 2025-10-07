'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import imageData from '@/lib/placeholder-images.json';

const { heroBackgrounds } = imageData;

export function HeroBackground() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % heroBackgrounds.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full">
        <AnimatePresence>
            <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 1 } }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
            >
                <Image
                    src={heroBackgrounds[index].src}
                    alt="Hero background"
                    fill
                    className="object-cover"
                    priority={index === 0}
                    data-ai-hint={heroBackgrounds[index].hint}
                />
            </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50" />
    </div>
  )
}
