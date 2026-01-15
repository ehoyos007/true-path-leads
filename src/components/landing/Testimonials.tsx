import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Phoenix, AZ",
    rating: 5,
    text: "I was drowning in credit card debt. True Horizon helped me consolidate everything and I'm saving over $400 a month. Life-changing!",
    savings: "$18,000",
  },
  {
    name: "Michael T.",
    location: "Austin, TX",
    rating: 5,
    text: "The team was incredibly supportive throughout the entire process. They explained everything clearly and got me the best rate possible.",
    savings: "$25,000",
  },
  {
    name: "Jennifer L.",
    location: "Miami, FL",
    rating: 5,
    text: "I was skeptical at first, but True Horizon delivered. My debt is now manageable and I finally see a light at the end of the tunnel.",
    savings: "$32,000",
  },
  {
    name: "David R.",
    location: "Seattle, WA",
    rating: 5,
    text: "Professional, responsive, and genuinely caring. They treated me like a person, not just a number. Highly recommend!",
    savings: "$21,000",
  },
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-card">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of satisfied customers who took control of their finances
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/2">
                <div className="bg-background border border-border rounded-2xl p-6 h-full">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  
                  <p className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total Savings</p>
                      <p className="text-lg font-bold text-success">{testimonial.savings}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12" />
          <CarouselNext className="hidden md:flex -right-12" />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
