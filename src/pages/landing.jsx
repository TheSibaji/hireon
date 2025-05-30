import { Link } from 'react-router-dom'
import '../index.css'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, } from '@/components/ui/carousel'
import companies from "../data/companies.json"
import faq from "../data/faq.json"
import Autoplay from 'embla-carousel-autoplay'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'


const LandingPage = () => {
  return (
    <>
      <main className='flex flex-col gap-10 sm:gap-20 py-10 sm:py-20'>

        {/* headline */}
        <section className='text-center'>
          <h1 className='flex flex-col items-center justify-center text-4xl font-extrabold sm:text-8xl tracking-tighter py-4 
                text-transparent bg-clip-text bg-gradient-to-b from-gray-500 via-gray-200 to-white'>
            {/* <h1 className='flex flex-col items-center justify-center gradient-title text-4xl font-extrabold sm:text-8xl tracking-tighter py-4'> */}
              Find Your Dream Job
              <span className='flex items-center gap-2 sm:gap-6'>
                and get Hired !
              </span>
          </h1>
          <p className='text-gray-300 sm:mt-4 text-xs sm:text-xl'>
            Explore recent job listings or find the perfect candidate
          </p>
        </section>

        {/* buttons */}
        <div className="flex flex-col gap-4 justify-center sm:flex-row sm:gap-6">
          <Link to="/jobs">
            <Button variant="blue" size="xl" className="w-full sm:w-auto">
              Find Jobs
            </Button>
          </Link>
          <Link to="/post-job">
            <Button variant="destructive" size="xl" className="w-full sm:w-auto">
              Post a Job
            </Button>
          </Link>
        </div>


        {/* carousel slides */}
        <Carousel plugins={[Autoplay({ delay: 2000})]} className="w-full py-10">
          <CarouselContent className="flex gap-5 sm:gap-20 items-center">
            {companies.map(({ name, id, path }) => {
              return (
                <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                  <img src={path} alt={name}
                  className='h-9 sm:h-14 object-contain'/>
                </CarouselItem>
              )
            })};
          </CarouselContent>
        </Carousel>

        {/* BANNER (In futuer if needed) */}

        {/* cards */}
        <section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-extrabold">For Job Seekers</CardTitle>
            </CardHeader>
            <CardContent className="font-bold">
              Search and apply for jobs, track applications, and more.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-extrabold">For Employers</CardTitle>
            </CardHeader>
            <CardContent className="font-bold">
              Post jobs, manage applications, and find the best candidates.
            </CardContent>
          </Card>
        </section>

        {/* faq section*/}
        <Accordion type="single" collapsible>
          {faq.map((faq, index) => {
            return (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>



      </main>
    </>
  )
}

export default LandingPage
