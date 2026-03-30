export const checkNested = (
  obj: Record<string, unknown>,
  searchTerm: string,
): boolean => {
  return Object.values(obj).some((value) =>
    typeof value === 'object' && value !== null
      ? checkNested(value as Record<string, unknown>, searchTerm)
      : typeof value === 'string' &&
        value.toLowerCase().includes(searchTerm.toLowerCase()),
  );
};

export const filterData = <T extends Record<string, unknown>>(
  chips: string[],
  data: T[],
): T[] => {
  if (chips.length === 0) return data;
  return data.filter((item) => chips.every((chip) => checkNested(item, chip)));
};

export interface SortLevel {
  key: string;
  direction: 'asc' | 'desc';
}

export interface SortConfig {
  primary: SortLevel | null;
  secondary: SortLevel | null;
}

const compareValues = <T>(
  a: T,
  b: T,
  key: string,
  direction: 'asc' | 'desc',
): number => {
  const aValue = (a as Record<string, unknown>)[key];
  const bValue = (b as Record<string, unknown>)[key];
  const sortDir = direction === 'asc' ? 1 : -1;

  if (aValue == null && bValue == null) return 0;
  if (aValue == null) return 1;
  if (bValue == null) return -1;

  if (key === 'dueDate') {
    const aDate = new Date(aValue as string);
    const bDate = new Date(bValue as string);
    if (isNaN(aDate.getTime()) || isNaN(bDate.getTime())) return 0;
    return (aDate.getTime() - bDate.getTime()) * sortDir;
  }

  if (aValue > bValue) return 1 * sortDir;
  if (aValue < bValue) return -1 * sortDir;
  return 0;
};

export const sortData = <T extends Record<string, unknown>>(
  data: T[],
  primaryKey: string | null,
  primaryDirection: 'asc' | 'desc' | 'none',
  secondaryKey?: string | null,
  secondaryDirection?: 'asc' | 'desc',
): T[] => {
  if (primaryDirection === 'none' || !primaryKey) return data;

  return [...data].sort((a: T, b: T) => {
    const primaryCompare = compareValues(
      a,
      b,
      primaryKey,
      primaryDirection as 'asc' | 'desc',
    );
    if (primaryCompare === 0 && secondaryKey && secondaryDirection) {
      return compareValues(a, b, secondaryKey, secondaryDirection);
    }
    return primaryCompare;
  });
};
