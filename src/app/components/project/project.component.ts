import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, mergeMap, Observable, take, tap } from 'rxjs';
import { Project } from 'src/app/models/project.model';
import { Task } from 'src/app/models/task.model';
import { loadTasks } from 'src/app/actions/data.actions';
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
      tap(projectId => this.store.dispatch(loadTasks({ projectId }))),
      mergeMap(projectId =>  this.store.select(selectProject( projectId )))
    );
    this.tasks$ = this.project$.pipe(
      mergeMap(project =>  this.store.select(selectTasks(project.id)))
    )
  }

  create() {
    this.project$?.pipe(
      filter(project => !!project),
      take(1),
    )
    .subscribe(project => {
      this.router.navigateByUrl(`/task-create?agentId=${encodeURIComponent(project.owner)}&projectId=${encodeURIComponent(project.id)}`)
    });
  }

}
