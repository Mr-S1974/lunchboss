'use server';
/**
 * @fileOverview A Genkit flow that generates a unique and humorous 'Hero's Commendation' message for the GoldenBell Hero.
 *
 * - generateGoldenBellCommendation - A function that handles the commendation generation process.
 * - GenerateGoldenBellCommendationInput - The input type for the generateGoldenBellCommendation function.
 * - GenerateGoldenBellCommendationOutput - The return type for the generateGoldenBellCommendation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateGoldenBellCommendationInputSchema = z.object({
  winnerName: z.string().describe("The name of the GoldenBell Hero who is paying for lunch."),
  winnerCharacter: z.string().describe("The humorous character type assigned to the winner (e.g., '법카 장전 과장')."),
});
export type GenerateGoldenBellCommendationInput = z.infer<typeof GenerateGoldenBellCommendationInputSchema>;

const GenerateGoldenBellCommendationOutputSchema = z.object({
  commendationMessage: z.string().describe("A unique and humorous commendation message for the GoldenBell Hero."),
});
export type GenerateGoldenBellCommendationOutput = z.infer<typeof GenerateGoldenBellCommendationOutputSchema>;

const generateCommendationPrompt = ai.definePrompt({
  name: 'generateGoldenBellCommendationPrompt',
  input: { schema: GenerateGoldenBellCommendationInputSchema },
  output: { schema: GenerateGoldenBellCommendationOutputSchema },
  prompt: `You are a lively and humorous announcer for the "GoldenBell Squad" app.
  Your task is to generate a unique, exciting, and highly shareable commendation message for the "GoldenBell Hero" who has been selected to pay for lunch.

  The winner's name is "{{{winnerName}}}".
  They are playing the role of "{{{winnerCharacter}}}".

  Craft a message that:
  - Celebrates their 'sacrifice' with a touch of humor.
  - Elevates them to the status of a true hero.
  - Motivates others to share this glorious announcement on social media or messaging apps.
  - Is concise and impactful, suitable for an app's result screen.
  - End with a celebratory phrase.

  Examples:
  "와우! 오늘 점심은 **[과장님]**이 쏘십니다! (멋져부러👍)"
  "긴급 속보! '텅장 사원' **[김대리]**가 오늘의 점심을 선사합니다! 박수 짝짝! 🎉"
  "세상에 이런 감동이! '법카 사냥꾼 대리' **[이팀장님]**께서 모든 점심 값을 쾌척합니다! 감사합니다! 💸"

  Generate only the commendation message.`,
});

const generateGoldenBellCommendationFlow = ai.defineFlow(
  {
    name: 'generateGoldenBellCommendationFlow',
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
