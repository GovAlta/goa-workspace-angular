export interface SearchResult {
  [key: string]: unknown;
  id: string;
  name: string;
  staff: string;
  dueDate: string;
  fileNumber: string;
  status: 'information' | 'success' | 'important' | 'emergency';
  statusText: string;
  type: 'client' | 'case' | 'application' | 'document';
  selected: boolean;
}

export type SortDirection = 'asc' | 'desc' | 'none';

export type BadgeType =
  | 'information'
  | 'success'
  | 'important'
  | 'emergency'
  | 'default'
  | 'sky'
  | 'prairie'
  | 'lilac'
  | 'pasture'
  | 'sunset'
  | 'archived'
  | 'dawn';

export interface TypeBadgeProps {
  type: BadgeType;
  content: string;
}
