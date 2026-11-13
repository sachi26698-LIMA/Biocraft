/**
 * Module-facing names for the shared Admin primitives. Kept in one file so a
 * module imports `Panel`, `Stat`, `StateNotice` … from here and never re-implements
 * a loading or permission state.
 */
export { Panel, Stat, Badge } from '../parts';
export { Loading, StateNotice, EmptyState, MessageBox, Toolbar, SearchField, SelectField, CursorPager, Field } from './ui';
