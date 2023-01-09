import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, mergeMap, filter, take, Observable } from 'rxjs';
import { updateTask } from 'src/app/actions/data.actions';
import { Project } from 'src/app/models/project.model';
import { selectProject } from 'src/app/selectors/data.selector';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css']
})
export class TaskCreateComponent implements OnInit {

  project$?: Observable<Project>

  taskForm = new UntypedFormGroup({
    label: new UntypedFormControl(''),
  })

  constructor(
    private route: ActivatedRoute,
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.project$ = this.route.queryParams.pipe(
      map(params => decodeURIComponent(params['projectId'])),
      mergeMap(projectId => this.store.select(selectProject(projectId))),
    );
  }
  onSubmit() {
    const label = this.taskForm.get('label')!.value;
    this.project$?.pipe(
      filter(project => !!project),
      take(1),
    )
    .subscribe(project => {
      this.store.dispatch(updateTask({ task: { id: 'DRAFT', label, project: project.id, owner: project.owner } }));
    });
  }
}
