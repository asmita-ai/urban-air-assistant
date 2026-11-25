import { GoogleGenerativeAI } from '@google/generative-ai';
import { AQIData, HouseholdProfile, RoutinePlan, IAQAuditResult } from '@/types';
import { calculateHouseholdVulnerability, calculateCommuteImpact } from '../aqiCalculator';
import { DEFAULT_GEMINI_MODEL } from '../constants';
import { RoutinePlanSchema } from '../schemas';
import { logger } from '../apiHelper';
import { buildRoutinePrompt, buildChatSystemContext } from './prompts';
import {
  generateDeterministicRoutinePlan,
  generateIAQAuditCalculation,
  getFallbackChatResponse,
} from './fallbacks';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Generates an intelligent, personalized Low-Emission Routine Plan using Gemini
 * with runtime Zod schema validation and deterministic fallback.
 */
export async function generateRoutinePlan(
  aqiData: AQIData,
  profile: HouseholdProfile
): Promise<RoutinePlan> {
  const vulnerabilityScore = calculateHouseholdVulnerability(profile, aqiData.aqi);
  const commuteStats = calculateCommuteImpact(profile.commuteDistanceKm, profile.commuteMode);

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: DEFAULT_GEMINI_MODEL });
      const prompt = buildRoutinePrompt(aqiData, profile, vulnerabilityScore);

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleaned = text
        .replace(/^```json/i, '')
        .replace(/```$/i, '')
        .trim();
      const rawJson = JSON.parse(cleaned);

      // Runtime schema validation with Zod
      const parseResult = RoutinePlanSchema.safeParse(rawJson);
      if (parseResult.success) {
        return parseResult.data as RoutinePlan;
      }

      logger.warn(
        'Gemini response did not strictly match RoutinePlan schema; using deterministic plan',
        {
          errors: parseResult.error.format(),
        }
      );
    } catch (err) {
      logger.warn('Gemini routine generation failed or timed out; using deterministic plan', err);
    }
  }

  return generateDeterministicRoutinePlan(aqiData, profile, vulnerabilityScore, commuteStats);
}

/**
 * Science-Backed Indoor Air Quality (IAQ) Audit
 */
export async function generateIAQAudit(
  aqiData: AQIData,
  profile: HouseholdProfile
): Promise<IAQAuditResult> {
  return generateIAQAuditCalculation(aqiData, profile);
}

/**
 * Interactive Smog Copilot Chat Handler with Gemini & Resilient Fallback
 */
export async function getChatResponse(
  message: string,
  history: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  aqiData: AQIData,
  profile: HouseholdProfile
): Promise<string> {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: DEFAULT_GEMINI_MODEL });
      const systemContext = buildChatSystemContext(aqiData, profile);

      const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: `System Context: ${systemContext}` }] },
          {
            role: 'model',
            parts: [
              {
                text: 'Understood. I am VayuMitra, ready to assist with real-time urban smog and air quality navigation.',
              },
            ],
          },
          ...history
            .filter((h) => h.role === 'user' || h.role === 'assistant')
            .map((h) => ({
              role: h.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: h.content }],
            })),
        ],
      });

      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (err) {
      logger.warn('Gemini chat call failed; using contextual fallback engine', err);
    }
  }

  return getFallbackChatResponse(message, aqiData, profile);
}
