import { DataInstance } from "@janeirodigital/interop-data-model";
import { RDFS } from '@janeirodigital/interop-namespaces';

export class Project {
  static shapeTree = 'http://localhost:3000/shapetrees/trees/Project';
  public label: string;

  constructor(dataInstance: DataInstance) {
    this.label = dataInstance.getObject(RDFS.label)!.value
  }
}
