import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, mergeMap, Observable, tap } from 'rxjs';
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
}
