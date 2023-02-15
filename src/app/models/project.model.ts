export interface Project {
  id: string,
  label: string,
  owner: string,
  registration: string,
  canUpdate?: boolean,
  canAddTasks?: boolean,
}
