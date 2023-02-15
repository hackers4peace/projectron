import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, tap, Observable, take, map, switchMap, withLatestFrom, EMPTY } from 'rxjs';
import { loadProjects, updateProject } from 'src/app/actions/data.actions';
import { Agent } from 'src/app/models/agent.model';
import { selectAgent } from 'src/app/selectors/data.selector';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css']
})
export class ProjectCreateComponent implements OnInit {

  selectedAgent$?: Observable<Agent>
  registrationId$: Observable<string> = EMPTY

  projectForm = new UntypedFormGroup({
    label: new UntypedFormControl(''),
  })

  constructor(
    private route: ActivatedRoute,
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.selectedAgent$ = this.route.queryParams.pipe(
      map(params => decodeURIComponent(params['agentId'])),
      switchMap(agentId => this.store.select(selectAgent(agentId))),
    );
    this.registrationId$ = this.route.queryParams.pipe(
      map(params => decodeURIComponent(params['registrationId'])),
    );
  }
  onSubmit() {
    const label = this.projectForm.get('label')!.value;
    this.selectedAgent$?.pipe(
      filter(agent => !!agent),
      take(1),
      withLatestFrom(this.registrationId$),
    ).subscribe(([agent, registrationId]) => {
      this.store.dispatch(updateProject({ project: { id: 'DRAFT', owner: agent.id, registration: registrationId, label} }));
    });
  }
}
