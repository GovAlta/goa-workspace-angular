import { SearchResult, TypeBadgeProps } from '../types/search-result';

export const getTypeBadgeProps = (
  type: SearchResult['type'],
): TypeBadgeProps => {
  const badgeMap: Record<SearchResult['type'], TypeBadgeProps> = {
    client: { type: 'lilac', content: 'Client' },
    case: { type: 'lilac', content: 'Case' },
    application: { type: 'pasture', content: 'Application' },
    document: { type: 'dawn', content: 'Document' },
  };
  return badgeMap[type];
};

export const getPriorityBadgeProps = (
  priority: 'high' | 'medium' | 'low',
): TypeBadgeProps => {
  const badgeMap: Record<'high' | 'medium' | 'low', TypeBadgeProps> = {
    high: { type: 'emergency', content: 'High' },
    medium: { type: 'important', content: 'Medium' },
    low: { type: 'archived', content: 'Low' },
  };
  return badgeMap[priority];
};
