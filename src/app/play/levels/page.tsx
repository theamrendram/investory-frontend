import React from 'react'
import { Button } from '@/components/ui/button'
const page = () => {
  return (
    <section className='bg-neutral-100 min-h-screen w-full p-8'>
        <div className="max-w-lg flex flex-col justify-center items-center gap-4 mx-auto">
            <Button>
                Start
            </Button>
            <Button>Resume</Button>
        </div>
    </section>
  )
}

export default page