"use client"
import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from "@/messages.json"
import Autoplay from "embla-carousel-autoplay"

const Home = () => {
  return (
    <>
    <main className='grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
     <section className='text-center mb-8 md:mb-12'>
     <h1 className='text-4xl font-bold text-center mb-3'>Dive into the World of Anonymous Conversations</h1> 
     <p className='text-2xl mt-3 mb-4'>Explore Mystry Message - Where your identity remains a secret.</p>
     </section>


      <Carousel
      opts={{ loop: true }}
      plugins={[Autoplay({delay:2000, stopOnMouseEnter: true,
      stopOnInteraction: false,})]}
      className="w-full max-w-xs">
      <CarouselContent>
        {
          messages.map((message, index)=>(
            <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader>{message.title}</CardHeader>
                <CardContent className="flex items-center justify-center px-6 py-1">
                  <span className="text-2xl font-semibold">{message.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          ))
        }
        
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </main>
    <footer className='text-center p-4 md:px-6 md:py-3 bg-black text-white'>
     © 2026 Mystry Message. All rights reserved.
    </footer>
    </>
  )
}

export default Home