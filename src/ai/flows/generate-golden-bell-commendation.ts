'use server';
/**
 * @fileOverview A Genkit flow that generates a unique and humorous 'Lunch Boss' message for the winner.
 *
 * - generateGoldenBellCommendation - A function that handles the commendation generation process.
 * - GenerateGoldenBellCommendationInput - The input type for the generateGoldenBellCommendation function.
 * - GenerateGoldenBellCommendationOutput - The return type for the generateGoldenBellCommendation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateGoldenBellCommendationInputSchema = z.object({
  winnerName: z.string().describe("The name of the Lunch Boss who is paying for lunch."),
  winnerCharacter: z.string().describe("The humorous character type assigned to the winner."),
});
export type GenerateGoldenBellCommendationInput = z.infer<typeof GenerateGoldenBellCommendationInputSchema>;

const GenerateGoldenBellCommendationOutputSchema = z.object({
  commendationMessage: z.string().describe("A unique and humorous commendation message for the Lunch Boss."),
});
export type GenerateGoldenBellCommendationOutput = z.infer<typeof GenerateGoldenBellCommendationOutputSchema>;

const generateCommendationPrompt = ai.definePrompt({
  name: 'generateLunchBossCommendationPrompt',
  input: { schema: GenerateGoldenBellCommendationInputSchema },
  output: { schema: GenerateGoldenBellCommendationOutputSchema },
  prompt: `You are a lively and humorous announcer for the "Lunch Boss" app.
  Your task is to generate a unique, exciting, and friendly commendation message for the "Lunch Boss" who has been selected to pay for lunch.

  The winner's name is "{{{winnerName}}}".
  They are playing the role of "{{{winnerCharacter}}}".

  Craft a message that:
  - Celebrates them as the 'Boss' of today's lunch.
  - Is lighthearted, energetic, and brings a smile to the team.
  - Uses food-related metaphors or office humor.
  - Is concise and impactful, suitable for an app's result screen.
  - End with a celebratory phrase.

  Examples:
  "오늘의 진정한 리더! **[이대리님]**이 쏘는 점심은 꿀맛 보장! 🍱"
  "긴급 속보! 오늘의 점심 보스는 바로 **[박과장님]**! 잘 먹겠습니다! 🙏"
  "세상에서 가장 멋진 결제! **[김사원]** 보스의 영수증 플렉스! 가즈아! 💸"

  Generate only the commendation message in Korean.`,
});

const generateGoldenBellCommendationFlow = ai.defineFlow(
  {
    name: 'generateLunchBossCommendationFlow',
    inputSchema: GenerateGoldenBellCommendationInputSchema,
    outputSchema: GenerateGoldenBellCommendationOutputSchema,
  },
  async (input) => {
    const { output } = await generateCommendationPrompt(input);
    return output!;
  }
);

export async function generateGoldenBellCommendation(input: GenerateGoldenBellCommendationInput): Promise<GenerateGoldenBellCommendationOutput> {
  return generateGoldenBellCommendationFlow(input);
}