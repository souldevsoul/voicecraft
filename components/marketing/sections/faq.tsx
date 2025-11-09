import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { Container } from "@/components/ui/container"
import { Heading, Text } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQProps extends React.HTMLAttributes<HTMLElement> {
  headline: string
  subheadline?: string
  items: FAQItem[]
  columns?: 1 | 2
}

const FAQ = React.forwardRef<HTMLElement, FAQProps>(
  ({ headline, subheadline, items, columns = 2, className, ...props }, ref) => {
    // Split items into columns if needed
    const columnItems = columns === 2
      ? [
          items.filter((_, i) => i % 2 === 0),
          items.filter((_, i) => i % 2 === 1),
        ]
      : [items]

    return (
      <section
        ref={ref}
        className={cn("py-20 md:py-32 bg-slate-50", className)}
        {...props}
      >
        <Container maxWidth="xl">
          {/* Header */}
          <div className="text-center mb-16">
            <Heading variant="h2" gradient="primary" className="mb-4">
              {headline}
            </Heading>
            {subheadline && (
              <Text variant="lead" className="max-w-3xl mx-auto">
                {subheadline}
              </Text>
            )}
          </div>

          {/* FAQ Grid */}
          <div className={cn(
            "grid gap-8",
            columns === 2 && "lg:grid-cols-2"
          )}>
            {columnItems.map((colItems, colIndex) => (
              <div key={colIndex}>
                <AccordionPrimitive.Root type="single" collapsible>
                  {colItems.map((item, itemIndex) => (
                    <AccordionPrimitive.Item
                      key={itemIndex}
                      value={`item-${colIndex}-${itemIndex}`}
                      className="border-b border-slate-200"
                    >
                      <AccordionPrimitive.Header>
                        <AccordionPrimitive.Trigger className="flex w-full items-center justify-between py-5 text-left text-lg font-bold text-slate-900 hover:text-yellow-500 transition-colors group uppercase">
                          {item.question}
                          <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </AccordionPrimitive.Trigger>
                      </AccordionPrimitive.Header>
                      <AccordionPrimitive.Content className="overflow-hidden text-slate-600 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                        <div className="pb-5 pr-8 leading-relaxed">
                          {item.answer}
                        </div>
                      </AccordionPrimitive.Content>
                    </AccordionPrimitive.Item>
                  ))}
                </AccordionPrimitive.Root>
              </div>
            ))}
          </div>
        </Container>
      </section>
    )
  }
)
FAQ.displayName = "FAQ"

export { FAQ }
