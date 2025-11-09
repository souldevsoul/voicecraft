"use client"

import { RiCoinsLine, RiAlertLine, RiArrowRightLine, RiHistoryLine } from "react-icons/ri"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Text, Heading } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export interface CreditBalanceCardProps {
  credits: number
  onAddCredits?: () => void
  onViewTransactions?: () => void
  recentTransactions?: {
    id: string
    type: "PROJECT_RESERVATION" | "PROJECT_COMPLETION" | "PROJECT_REFUND" | "CREDIT_PURCHASE"
    amount: number
    description: string
    createdAt: string
  }[]
  compact?: boolean
}

export function CreditBalanceCard({
  credits,
  onAddCredits,
  onViewTransactions,
  recentTransactions,
  compact = false,
}: CreditBalanceCardProps) {
  // Convert credits to dollars (1 credit = $0.01)
  const dollars = credits / 100
  const isLow = credits < 10000 // Less than $100
  const isCritical = credits < 1000 // Less than $10

  // Compact version for sidebar/header
  if (compact) {
    return (
      <Card variant="outlined" className={`border-4 ${isCritical ? "border-red-500" : isLow ? "border-orange-500" : "border-black"}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`rounded-md border-4 border-black p-2 ${isCritical ? "bg-red-100" : isLow ? "bg-orange-100" : "bg-yellow-100"}`}>
                <RiCoinsLine className={`h-5 w-5 ${isCritical ? "text-red-600" : isLow ? "text-orange-600" : "text-yellow-600"}`} />
              </div>
              <div>
                <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
                  CREDIT BALANCE
                </Text>
                <Heading variant="h3" className="font-bold">
                  ${dollars.toFixed(2)}
                </Heading>
                <Text variant="caption" className="text-xs text-slate-500">
                  {credits.toLocaleString()} credits
                </Text>
              </div>
            </div>
            {(isLow || isCritical) && (
              <Badge variant={isCritical ? "danger" : "warning"} className="text-xs">
                {isCritical ? "CRITICAL" : "LOW"}
              </Badge>
            )}
          </div>
          {onAddCredits && (
            <Button
              variant="primary"
              size="sm"
              className="mt-3 w-full"
              onClick={onAddCredits}
            >
              <RiCoinsLine className="mr-2 h-4 w-4" />
              ADD CREDITS
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // Full version for dashboard
  return (
    <Card
      variant={isCritical ? "outlined" : "gradient"}
      className={`border-4 ${isCritical ? "border-red-500 bg-red-50" : isLow ? "border-orange-500" : "border-black"}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RiCoinsLine className="h-6 w-6" />
          CREDIT BALANCE
        </CardTitle>
        <CardDescription className={isCritical ? "text-red-900" : isLow ? "text-orange-900" : "text-black/80"}>
          Your available credits for project reservations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balance Display */}
        <div className="rounded-md border-4 border-black bg-white p-6 text-center">
          <Text variant="caption" className="text-xs font-bold uppercase text-slate-600">
            AVAILABLE BALANCE
          </Text>
          <Heading variant="h1" className="mt-2 text-5xl font-bold">
            ${dollars.toFixed(2)}
          </Heading>
          <Text variant="caption" className="mt-1 text-sm text-slate-500">
            {credits.toLocaleString()} credits
          </Text>
        </div>

        {/* Warning */}
        {(isLow || isCritical) && (
          <div className={`rounded-md border-4 p-4 ${isCritical ? "border-red-500 bg-red-100" : "border-orange-500 bg-orange-100"}`}>
            <div className="flex items-start gap-3">
              <RiAlertLine className={`h-5 w-5 flex-shrink-0 ${isCritical ? "text-red-600" : "text-orange-600"}`} />
              <div className="flex-1">
                <Heading variant="h3" className={`text-sm font-bold ${isCritical ? "text-red-900" : "text-orange-900"}`}>
                  {isCritical ? "CRITICAL BALANCE" : "LOW BALANCE"}
                </Heading>
                <Text variant="body" className={`mt-1 text-sm ${isCritical ? "text-red-800" : "text-orange-800"}`}>
                  {isCritical
                    ? "Your credit balance is critically low. Add credits to accept project estimates."
                    : "Your credit balance is running low. Consider adding more credits soon."}
                </Text>
              </div>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        {recentTransactions && recentTransactions.length > 0 && (
          <>
            <Separator className="bg-black" />
            <div>
              <div className="mb-3 flex items-center justify-between">
                <Heading variant="h3" className="text-sm font-bold uppercase">
                  RECENT TRANSACTIONS
                </Heading>
                {onViewTransactions && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onViewTransactions}
                  >
                    VIEW ALL
                    <RiArrowRightLine className="ml-2 h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="space-y-2 rounded-md border-4 border-black bg-white p-4">
                {recentTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between border-b border-slate-200 pb-2 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <Text variant="body" className="text-sm font-medium">
                        {getTransactionTypeLabel(transaction.type)}
                      </Text>
                      <Text variant="caption" className="text-xs text-slate-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </Text>
                    </div>
                    <Badge
                      variant={transaction.amount > 0 ? "success" : "default"}
                      className="text-xs"
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount.toLocaleString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex gap-3">
        {onAddCredits && (
          <Button variant="primary" className="flex-1" onClick={onAddCredits}>
            <RiCoinsLine className="mr-2 h-4 w-4" />
            ADD CREDITS
          </Button>
        )}
        {onViewTransactions && (
          <Button variant="outline" className="flex-1 border-4" onClick={onViewTransactions}>
            <RiHistoryLine className="mr-2 h-4 w-4" />
            VIEW HISTORY
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

// Helper function to get transaction type label
function getTransactionTypeLabel(type: string): string {
  switch (type) {
    case "PROJECT_RESERVATION":
      return "Project Reservation"
    case "PROJECT_COMPLETION":
      return "Project Payment"
    case "PROJECT_REFUND":
      return "Project Refund"
    case "CREDIT_PURCHASE":
      return "Credit Purchase"
    default:
      return "Transaction"
  }
}
