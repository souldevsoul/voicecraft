"use client"

type ClientDateProps = {
  date: string
  className?: string
}

export function ClientDate({ date, className }: ClientDateProps) {
  return (
    <span className={className} suppressHydrationWarning>
      {new Date(date).toLocaleDateString()}
    </span>
  )
}
