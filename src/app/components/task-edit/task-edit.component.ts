import { Component, OnInit } from '@angular/core';

import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, mergeMap, Observable, take } from 'rxjs';
import { updateTask } from 'src/app/actions/data.actions';
import { Task } from 'src/app/models/task.model';
import { selectTask } from 'src/app/selectors/data.selector';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {

  task$?: Observable<Task>;

  taskForm = new UntypedFormGroup({
    label: new UntypedFormControl(''),
  })

  constructor(
    private route: ActivatedRoute,
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.task$ = this.route.queryParams.pipe(
      map(params => decodeURIComponent(params['taskId'])),
      mergeMap(taskId => this.store.select(selectTask(taskId))),
    );
  }
  onSubmit() {
    const label = this.taskForm.get('label')!.value;
    this.task$?.pipe(
      filter(task => !!task),
      take(1),
    )
    .subscribe(task => {
      this.store.dispatch(updateTask({ task: { ...task, label } }));
    });
  }
}
