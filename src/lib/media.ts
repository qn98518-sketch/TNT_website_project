const base = '/images/collection/';

/** Consistent editorial photography. Existing content records remain unchanged. */
const replacements: Record<string, string> = {
  '/images/food_process_factory.webp': 'factory-food',
  '/images/reference/food-factory-clear.webp': 'factory-food',
  '/images/glass_factory.webp': 'factory-glass',
  '/images/work_factory.webp': 'factory-glass',
  '/images/wood_factory.webp': 'factory-wood',
  '/images/business_technology.webp': 'technology',
  '/images/ai_usage.webp': 'technology',
  '/images/cloud_computing.webp': 'technology',
  '/images/cyber_shield.webp': 'technology',
  '/images/education.webp': 'learning',
  '/images/solution.webp': 'consulting',
  '/images/reference/tnt-factory-consulting.webp': 'consulting',
};

export const media = {
  food: base + 'factory-food.webp',
  glass: base + 'factory-glass.webp',
  wood: base + 'factory-wood.webp',
  software: base + 'software-team.webp',
  team: base + 'staffing-team.webp',
  warehouse: base + 'warehouse.webp',
  learning: base + 'learning.webp',
  consulting: base + 'consulting.webp',
  technology: base + 'technology.webp',
};

export function resolveMedia(src: string) {
  return replacements[src] ? base + replacements[src] + '.webp' : src;
}

export function articleMedia(slug: string, fallback?: string) {
  return ({
    'erp-du-lieu': media.food,
    'chuan-bi-erp': media.consulting,
    'van-hanh-nha-may': media.glass,
    'khi-nao-outsourcing': media.software,
    'quan-ly-kho': media.warehouse,
    'bo-sung-nhan-su': media.team,
  } as Record<string, string>)[slug] ?? resolveMedia(fallback ?? media.technology);
}

export function projectMedia(slug: string, fallback?: string) {
  return ({ kala: media.glass, wood: media.wood, recruitment: media.software, elearning: media.learning } as Record<string,string>)[slug] ?? resolveMedia(fallback ?? media.technology);
}
