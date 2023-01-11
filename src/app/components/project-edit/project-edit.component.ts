import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, tap, mergeMap, Observable, take, map } from 'rxjs';
import { updateProject } from 'src/app/actions/data.actions';
import { Project } from 'src/app/models/project.model';
import { selectProject } from 'src/app/selectors/data.selector';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {
  project$?: Observable<Project>;

  projectForm = new UntypedFormGroup({
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
    const label = this.projectForm.get('label')!.value;
    this.project$?.pipe(
      filter(project => !!project),
      take(1),
    )
    .subscribe(project => {
      this.store.dispatch(updateProject({ project: { ...project, label } }));
    });
  }
}
