export interface Task {
  id: string,
  label: string,
  project: string,
  owner: string,
  canUpdate?: boolean,
  canDelete?: boolean
}
