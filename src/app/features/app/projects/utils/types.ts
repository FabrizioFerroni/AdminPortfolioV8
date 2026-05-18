import { Signal, computed } from '@angular/core';
import { InsertOrUpdateProjectTecDto } from '../interfaces';

export const CATEGORY_CONFIG = {
  frontend: {
    label: 'Frontend',
    color: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
  },
  backend: {
    label: 'Backend',
    color: 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30',
  },
  devops: {
    label: 'DevOps',
    color: 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
  },
  database: {
    label: 'Bases de datos',
    color: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
  },
  tools: {
    label: 'Herramientas',
    color: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30',
  },
  other: {
    label: 'Otros',
    color: 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30',
  },
} as const;

export type TechnologyCategory = keyof typeof CATEGORY_CONFIG;

export function groupTechnologiesByCategory(
  technologiesSignal: Signal<InsertOrUpdateProjectTecDto[]>
) {
  return computed(() =>
    (Object.entries(CATEGORY_CONFIG) as [TechnologyCategory, { label: string; color: string }][])
      .map(([key, config]) => ({
        key,
        ...config,
        techs: technologiesSignal().filter(t => t.category === key),
      }))
      .filter(group => group.techs.length > 0)
  );
}
