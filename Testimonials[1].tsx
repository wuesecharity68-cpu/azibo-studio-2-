'use client'

import { useEffect, useState } from 'react'
import {
collection,
limit,
onSnapshot,
orderBy,
query,
type Timestamp,
} from 'firebase/firestore'
import { getDb } from '@/lib/firebase'
import { Star } from 'lucide-react'

interface Testimonial {
id: string
name: string
photo?: string
rating: number
quote: string
createdAt?: number | Timestamp
}

export default function Testimonials() {
const [testimonials, setTestimonials] = useState<Testimonial[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
let unsubscribe: (() => void) | undefined

try {
const db = getDb()

const testimonialsQuery = query(
collection(db, 'testimonials'),
orderBy('createdAt', 'desc'),
limit(6),
)

unsubscribe = onSnapshot(
testimonialsQuery,
(snapshot) => {
const data: Testimonial[] = snapshot.docs.map((doc) => {
const raw = doc.data()

return {  
      id: doc.id,  
      name: typeof raw.name === 'string' ? raw.name : 'AZIBO User',  
      photo: typeof raw.photo === 'string' ? raw.photo : undefined,  
      rating:  
        typeof raw.rating === 'number'  
          ? Math.min(5, Math.max(0, raw.rating))  
          : 0,  
      quote: typeof raw.quote === 'string' ? raw.quote : '',  
      createdAt: raw.createdAt,  
    }  
  })  

  setTestimonials(data.filter((testimonial) => testimonial.quote.trim()))  
  setLoading(false)  
},  
(error) => {  
  console.error('[Testimonials] Error fetching testimonials:', error)  
  setTestimonials([])  
  setLoading(false)  
},

)
} catch (error) {
console.error('[Testimonials] Failed to initialize testimonials:', error)
setTestimonials([])
setLoading(false)
}

return () => {
unsubscribe?.()
}

}, [])

return (

<section className="py-20 px-4 bg-background">  
<div className="max-w-5xl mx-auto">  
{/* Section header */}  
<div className="text-center mb-16">  
<h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">  
What Creators Are Saying  
</h2>  <p className="text-lg text-muted-foreground">  
    See what people are creating with AZIBO STUDIO  
  </p>  
</div>  

{/* Testimonials grid */}  
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">  
  {loading ? (  
    <>  
      {[...Array(3)].map((_, index) => (  
        <div  
          key={index}  
          className="h-64 bg-card rounded-lg animate-pulse"  
        />  
      ))}  
    </>  
  ) : testimonials.length > 0 ? (  
    testimonials.map((testimonial) => (  
      <div  
        key={testimonial.id}  
        className="p-6 bg-card border border-border rounded-lg"  
      >  
        {/* Rating */}  
        <div  
          className="flex gap-1 mb-4"  
          aria-label={`${testimonial.rating} out of 5 stars`}  
        >  
          {[...Array(5)].map((_, index) => (  
            <Star  
              key={index}  
              className={`h-4 w-4 ${  
                index < testimonial.rating  
                  ? 'fill-primary text-primary'  
                  : 'text-muted-foreground'  
              }`}  
            />  
          ))}  
        </div>  

        {/* Quote */}  
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">  
          &quot;{testimonial.quote}&quot;  
        </p>  

        {/* Author */}  
        <div className="flex items-center gap-3">  
          {testimonial.photo ? (  
            <img  
              src={testimonial.photo}  
              alt={testimonial.name}  
              className="h-10 w-10 rounded-full object-cover"  
            />  
          ) : (  
            <div  
              className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold"  
              aria-hidden="true"  
            >  
              {testimonial.name.charAt(0).toUpperCase()}  
            </div>  
          )}  

          <div>  
            <p className="font-semibold text-foreground text-sm">  
              {testimonial.name}  
            </p>  
            <p className="text-xs text-muted-foreground">  
              AZIBO User  
            </p>  
          </div>  
        </div>  
      </div>  
    ))  
  ) : (  
    <div className="col-span-full text-center py-12">  
      <p className="text-muted-foreground">  
        No testimonials yet. Be the first to share!  
      </p>  
    </div>  
  )}  
</div>

  </div>  
</section>  )
}