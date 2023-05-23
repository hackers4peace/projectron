export interface FileInstance {
    id: string,
    filename?: string,
    project: string,
    owner: string,
    canUpdate?: boolean,
    canDelete?: boolean,
  }