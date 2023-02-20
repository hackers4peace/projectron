import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, filter, map, mergeMap, Observable, take, tap } from 'rxjs';
import { Project } from 'src/app/models/project.model';
import { Task } from 'src/app/models/task.model';
import { deleteProject, loadTasks, shareProject } from 'src/app/actions/data.actions';
import { selectProject, selectTasks } from 'src/app/selectors/data.selector';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  project$?: Observable<Project>;
  tasks$?: Observable<Task[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.project$ = this.route.queryParams.pipe(
      map(params => decodeURIComponent(params['projectId'])),
      mergeMap(projectId =>  this.store.select(selectProject( projectId ))),
    );
    this.tasks$ = this.project$.pipe(
      filter(project => !!project),
      tap(project => this.store.dispatch(loadTasks({ projectId: project.id }))),
      mergeMap(project =>  this.store.select(selectTasks(project.id))),
    )
  }
  getProject(): Promise<Project> {
    return new Promise((resolve, reject) => {
      this.project$?.pipe(
        filter(project => !!project),
        take(1),
      )
      .subscribe({
        next: project => resolve(project),
        error: err => reject(err)
      })
    })
  }

  async create() {
    const project = await this.getProject();
    this.router.navigateByUrl(`/task-create?agentId=${encodeURIComponent(project.owner)}&projectId=${encodeURIComponent(project.id)}`)
  }

  async delete() {
    if (confirm('Are you sure to delete')) {
      const project = await this.getProject();
      this.store.dispatch(deleteProject({ project }));
    }
  }

  async share() {
    const project = await this.getProject();
    this.store.dispatch(shareProject({ project }));
  }
}
