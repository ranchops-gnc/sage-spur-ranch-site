import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const journal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum([
      'Ranch Work',
      'Recovery & Resilience',
      'Cowboy Life',
      'Chosen Family',
    ]),
    publishedAt: z.coerce.date(),
    readingTime: z.string(),
  }),
});

export const collections = { journal };
