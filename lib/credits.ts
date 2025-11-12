/**
 * Credit Management System
 * Handles credit operations and transactions
 */

import { prisma } from '@/lib/prisma';

// Credit costs for different operations
export const CREDIT_COSTS = {
  VOICE_GENERATION: 10,
  VOICE_CLONING: 50,
  AI_ESTIMATION: 5,
} as const;

export type CreditOperationType = keyof typeof CREDIT_COSTS;

export const CREDIT_TRANSACTION_TYPES = {
  // Deductions
  VOICE_GENERATION: 'VOICE_GENERATION',
  VOICE_CLONING: 'VOICE_CLONING',
  AI_ESTIMATION: 'AI_ESTIMATION',

  // Additions
  CREDIT_PURCHASE: 'CREDIT_PURCHASE',
  SUBSCRIPTION_GRANT: 'SUBSCRIPTION_GRANT',
  PROMOTIONAL_GRANT: 'PROMOTIONAL_GRANT',
  REFUND: 'REFUND',

  // Project-related
  PROJECT_RESERVATION: 'PROJECT_RESERVATION',
  PROJECT_COMPLETION: 'PROJECT_COMPLETION',
  PROJECT_REFUND: 'PROJECT_REFUND',
} as const;

/**
 * Get user's current credit balance
 */
export async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  return user?.credits || 0;
}

/**
 * Check if user has enough credits for an operation
 */
export async function hasEnoughCredits(
  userId: string,
  amount: number
): Promise<boolean> {
  const currentCredits = await getUserCredits(userId);
  return currentCredits >= amount;
}

/**
 * Deduct credits from user account
 * @throws Error if insufficient credits
 */
export async function deductCredits(
  userId: string,
  amount: number,
  type: string,
  description: string,
  metadata?: any
): Promise<{ success: boolean; newBalance: number }> {
  // Check if user has enough credits
  const currentCredits = await getUserCredits(userId);

  if (currentCredits < amount) {
    throw new Error(
      `Insufficient credits. Required: ${amount}, Available: ${currentCredits}`
    );
  }

  // Perform transaction
  const result = await prisma.$transaction(async (tx) => {
    // Deduct credits from user
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { credits: { decrement: amount } },
      select: { credits: true },
    });

    // Record transaction in ledger
    await tx.creditLedger.create({
      data: {
        userId,
        amount: -amount, // Negative for deduction
        type,
        description,
        metadata: metadata || {},
      },
    });

    return { success: true, newBalance: updatedUser.credits };
  });

  return result;
}

/**
 * Add credits to user account
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: string,
  description: string,
  metadata?: any
): Promise<{ success: boolean; newBalance: number }> {
  const result = await prisma.$transaction(async (tx) => {
    // Add credits to user
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } },
      select: { credits: true },
    });

    // Record transaction in ledger
    await tx.creditLedger.create({
      data: {
        userId,
        amount, // Positive for addition
        type,
        description,
        metadata: metadata || {},
      },
    });

    return { success: true, newBalance: updatedUser.credits };
  });

  return result;
}

/**
 * Deduct credits for voice generation
 */
export async function deductVoiceGenerationCredits(
  userId: string,
  metadata?: any
): Promise<{ success: boolean; newBalance: number }> {
  return deductCredits(
    userId,
    CREDIT_COSTS.VOICE_GENERATION,
    CREDIT_TRANSACTION_TYPES.VOICE_GENERATION,
    'Voice generation',
    metadata
  );
}

/**
 * Deduct credits for voice cloning
 */
export async function deductVoiceCloningCredits(
  userId: string,
  voiceName: string,
  metadata?: any
): Promise<{ success: boolean; newBalance: number }> {
  return deductCredits(
    userId,
    CREDIT_COSTS.VOICE_CLONING,
    CREDIT_TRANSACTION_TYPES.VOICE_CLONING,
    `Voice cloning: ${voiceName}`,
    metadata
  );
}

/**
 * Deduct credits for AI estimation
 */
export async function deductAIEstimationCredits(
  userId: string,
  projectId: string,
  metadata?: any
): Promise<{ success: boolean; newBalance: number }> {
  const result = await prisma.$transaction(async (tx) => {
    // Deduct credits from user
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { credits: { decrement: CREDIT_COSTS.AI_ESTIMATION } },
      select: { credits: true },
    });

    // Record transaction in ledger with project reference
    await tx.creditLedger.create({
      data: {
        userId,
        projectId,
        amount: -CREDIT_COSTS.AI_ESTIMATION,
        type: CREDIT_TRANSACTION_TYPES.AI_ESTIMATION,
        description: 'AI project estimation',
        metadata: metadata || {},
      },
    });

    return { success: true, newBalance: updatedUser.credits };
  });

  return result;
}

/**
 * Get user's credit transaction history
 */
export async function getCreditHistory(
  userId: string,
  limit: number = 50
): Promise<any[]> {
  const transactions = await prisma.creditLedger.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return transactions;
}

/**
 * Grant initial credits to new user
 */
export async function grantInitialCredits(userId: string): Promise<void> {
  const INITIAL_CREDITS = 100; // Free credits for new users

  await addCredits(
    userId,
    INITIAL_CREDITS,
    CREDIT_TRANSACTION_TYPES.PROMOTIONAL_GRANT,
    'Welcome bonus - initial credits',
    { source: 'new_user_signup' }
  );
}

/**
 * Purchase credits (to be integrated with payment system)
 */
export async function purchaseCredits(
  userId: string,
  amount: number,
  paymentId: string,
  metadata?: any
): Promise<{ success: boolean; newBalance: number }> {
  return addCredits(
    userId,
    amount,
    CREDIT_TRANSACTION_TYPES.CREDIT_PURCHASE,
    `Purchased ${amount} credits`,
    { paymentId, ...metadata }
  );
}

/**
 * Refund credits
 */
export async function refundCredits(
  userId: string,
  amount: number,
  reason: string,
  metadata?: any
): Promise<{ success: boolean; newBalance: number }> {
  return addCredits(
    userId,
    amount,
    CREDIT_TRANSACTION_TYPES.REFUND,
    `Refund: ${reason}`,
    metadata
  );
}
