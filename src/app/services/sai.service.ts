import { Injectable } from '@angular/core';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { Application } from '@janeirodigital/interop-application';
import { DataInstance } from '@janeirodigital/interop-data-model';
import { ACL, RDFS, buildNamespace } from '@janeirodigital/interop-namespaces';
import { environment } from 'src/environments/environment';
import { Project } from '../models/project.model';
import { Task } from '../models/task.model';
import { Image } from '../models/image.model';
import { Agent } from '../models/agent.model';
import { Registration } from '../models/registration.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileInstance } from '../models/file.model';

class NoSaiSessionError extends Error {
  constructor() {
    super('buildSession was not called');
  }
}

const NFO = buildNamespace('http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#')
const AWOL = buildNamespace('http://bblfish.net/work/atom-owl/2006-06-06/#')

const shapeTrees = {
  project: 'http://localhost:3000/shapetrees/trees/Project',
  task: 'http://localhost:3000/shapetrees/trees/Task',
  image: 'http://localhost:3000/shapetrees/trees/Image',
  file: 'http://localhost:3000/shapetrees/trees/File',
}

function instance2Project(instance: DataInstance, owner: string, registration: string): Project {
  return {
    id: instance.iri,
    label: instance.getObject(RDFS.label)!.value,
    owner,
    registration,
    canUpdate: instance.accessMode.includes(ACL.Update.value),
    canAddTasks: instance.findChildGrant(shapeTrees.task)?.accessMode.includes(ACL.Create.value),
    canAddImages: instance.findChildGrant(shapeTrees.image)?.accessMode.includes(ACL.Create.value),
    canAddFiles: instance.findChildGrant(shapeTrees.file)?.accessMode.includes(ACL.Create.value),
  }
}

function instance2Task(instance: DataInstance, project: string, owner: string): Task {
  return {
    id: instance.iri,
    label: instance.getObject(RDFS.label)!.value,
    project,
    owner,
    canUpdate: instance.accessMode.includes(ACL.Update.value),
    canDelete: instance.accessMode.includes(ACL.Delete.value),
  }
}

function instance2File(instance: DataInstance, project: string, owner: string): Image {
  return {
    id: instance.iri,
    filename: instance.getObject(NFO.fileName)?.value,
    project,
    owner,
    canUpdate: instance.accessMode.includes(ACL.Update.value),
    canDelete: instance.accessMode.includes(ACL.Delete.value),
  }
}

@Injectable({
  providedIn: 'root'
})
export class SaiService {
  private session: Application | undefined;
  private cache: { [key: string]: DataInstance } = {}
  private ownerIndex: { [key: string]: string } = {}
  private fetch = getDefaultSession().fetch;

  constructor(private sanitizer: DomSanitizer) {}

  async buildSession(userId: string): Promise<Application> {
    this.session = await Application.build(
      userId!,
      environment.applicationId,
      { fetch: this.fetch, randomUUID: crypto.randomUUID.bind(crypto) }
    );

    return this.session;
  }

  authorize() {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    if (this.session.authorizationRedirectUri) {
      window.location.href = this.session.authorizationRedirectUri;
    } else {
      throw new Error('authorizationRedirectUri is undefined');
    }
  }

  share(resource: {id: string}) {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    const shareUri = this.session.getShareUri(resource.id);
    if (shareUri) {
      window.localStorage.setItem('restorePath', `${window.location.pathname}${window.location.search}`)
      window.location.href = shareUri;
    } else {
      throw new Error('shareUri is undefined')
    }
  }

  async getAgents(): Promise<Agent[]> {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    const session = this.session
    const profiles = await Promise.all(
      this.session.dataOwners.map(owner => session.factory.readable.webIdProfile(owner.iri))
    )
    return profiles.map(profile => ({
      id: profile.iri,
      label: profile.label || 'unknown' // TODO think of a better fallback
    }))
  }

  async loadProjects(ownerId: string): Promise<{ownerId: string, projects: Project[], registrations: Registration[]}> {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    const user = this.session.dataOwners.find((agent) => agent.iri === ownerId);
    if (!user) {
      throw new Error(`data registration not found for ${ownerId}`)
    }
    const projects: Project[] = [];
    const registrations: Registration[] = [];
    for (const registration of user.selectRegistrations(shapeTrees.project)) {
      registrations.push({
          id: registration.iri,
          label: 'TODO',
          owner: ownerId,
          canCreate: registration.grant.accessMode.includes(ACL.Create.value),
      })
      for await (const dataInstance of registration.dataInstances) {
        this.cache[dataInstance.iri] = dataInstance
        this.ownerIndex[dataInstance.iri] = ownerId
        projects.push(instance2Project(dataInstance, ownerId, registration.iri));
      }
    }

    return {ownerId, projects, registrations}
  }

  async updateProject(project: Project) {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    let instance: DataInstance
    if (project.id !== 'DRAFT') {
      const cached = this.cache[project.id]
      if (!cached) {
        throw new Error(`Data Instance not found for: ${project.id}`)
      }
      instance = cached
    } else {
      const user = this.session.dataOwners.find((agent) => agent.iri === project.owner);
      if (!user) {
        throw new Error(`user not found for ${project.owner}`)
      }
      const registration = user.selectRegistrations(shapeTrees.project).find(registration => registration.iri === project.registration)
      if (!registration) {
        throw new Error(`data registrationnot found for ${project.registration}`)
      }
      instance = await registration.newDataInstance()
      this.cache[instance.iri] = instance
    }

    instance.replaceValue(RDFS.label, project.label);

    await instance.update(instance.dataset)

    return instance2Project(instance, project.owner, project.registration)
  }

  async loadTasks(projectId: string): Promise<{projectId: string, tasks: Task[]}> {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    const project = this.cache[projectId]
    if (!project) {
      throw new Error(`Project not found for: ${projectId}`)
    }
    const tasks = [];
    for await (const dataInstance of project.getChildInstancesIterator(shapeTrees.task)) {
      this.cache[dataInstance.iri] = dataInstance
      tasks.push(instance2Task(dataInstance, projectId, this.ownerIndex[projectId]));
    }

    return {projectId, tasks}
  }

  async updateTask(task: Task) {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    let instance: DataInstance
    if (task.id !== 'DRAFT') {
      const cached = this.cache[task.id]
      if (!cached) {
        throw new Error(`Data Instance not found for: ${task.id}`)
      }
      instance = cached
    } else {
      const project = this.cache[task.project]
      if (!project) {
        throw new Error(`project not found ${task.project}`)
      }
      instance = await project.newChildDataInstance(shapeTrees.task)
      this.cache[instance.iri] = instance
    }

    instance.replaceValue(RDFS.label, task.label);
    
    await instance.update(instance.dataset)

    return instance2Task(instance, task.project, task.owner)
  }

  async deleteTask(task: Task): Promise<Task> {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    let instance: DataInstance

    instance = this.cache[task.id];
    await instance.delete();

    delete this.cache[task.id];

    return task;
  }

  async deleteProject(project: Project): Promise<Project> {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    let instance: DataInstance

    instance = this.cache[project.id];
    await instance.delete();

    delete this.cache[project.id];

    return project;
  }

  async loadFiles(projectId: string): Promise<{projectId: string, files: FileInstance[]}> {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    const project = this.cache[projectId]
    if (!project) {
      throw new Error(`Project not found for: ${projectId}`)
    }
    const files = [];
    for await (const dataInstance of project.getChildInstancesIterator(shapeTrees.file)) {
      this.cache[dataInstance.iri] = dataInstance
      files.push(instance2File(dataInstance, projectId, this.ownerIndex[projectId]));
    }

    return {projectId, files}
  }

  async updateFile(file: FileInstance, blob?: File): Promise<Image> {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    let instance: DataInstance
    if (file.id !== 'DRAFT') {
      const cached = this.cache[file.id]
      if (!cached) {
        throw new Error(`Data Instance not found for: ${file.id}`)
      }
      instance = cached
    } else {
      if (!blob) {
        throw new Error(`image file missing`)
      }
      const project = this.cache[file.project]
      if (!project) {
        throw new Error(`project not found ${file.project}`)
      }
      

      instance = await project.newChildDataInstance(shapeTrees.file)
      instance.replaceValue(NFO.fileName, blob.name)
      instance.replaceValue(AWOL.type, blob.type)
      this.cache[instance.iri] = instance
      await instance.update(instance.dataset, blob)
    }

    return instance2File(instance, file.project, file.owner)
  }

  async loadImages(projectId: string): Promise<{projectId: string, images: Image[]}> {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    const project = this.cache[projectId]
    if (!project) {
      throw new Error(`Project not found for: ${projectId}`)
    }
    const images = [];
    for await (const dataInstance of project.getChildInstancesIterator(shapeTrees.image)) {
      this.cache[dataInstance.iri] = dataInstance
      images.push(instance2File(dataInstance, projectId, this.ownerIndex[projectId]));
    }

    return {projectId, images}
  }

  async updateImage(image: Image, file?: File): Promise<Image> {
    if (!this.session) {
      throw new NoSaiSessionError();
    }
    let instance: DataInstance
    if (image.id !== 'DRAFT') {
      const cached = this.cache[image.id]
      if (!cached) {
        throw new Error(`Data Instance not found for: ${image.id}`)
      }
      instance = cached
    } else {
      if (!file) {
        throw new Error(`image file missing`)
      }
      const project = this.cache[image.project]
      if (!project) {
        throw new Error(`project not found ${image.project}`)
      }
      

      instance = await project.newChildDataInstance(shapeTrees.image)
      instance.replaceValue(NFO.fileName, file.name)
      instance.replaceValue(AWOL.type, file.type)
      this.cache[instance.iri] = instance
      await instance.update(instance.dataset, file)
    }

    return instance2File(instance, image.project, image.owner)
  }


  async dataUrl(url: string, safe = true): Promise<SafeUrl | string> {
    const fetch = getDefaultSession().fetch
    return fetch(url)
      .then(response => response.blob())
      .then(blb => URL.createObjectURL(blb))
      .then(url => safe ? this.sanitizer.bypassSecurityTrustUrl(url) : url)
  }
}
