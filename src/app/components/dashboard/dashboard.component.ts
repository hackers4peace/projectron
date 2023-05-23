import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { loadProjects } from 'src/app/actions/data.actions';
import { Agent } from 'src/app/models/agent.model';
import { Project } from 'src/app/models/project.model';
import { Registration } from 'src/app/models/registration.model';
import { selectAgent, selectAgents, selectProjects, selectRegistrations } from 'src/app/selectors/data.selector';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  agents$ = this.store.select(selectAgents)
  selectedAgent$?: Observable<Agent>
  projects$?: Observable<Project[]> 
  registrations$?: Observable<Registration[]>

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
  ) { }

  selectAgent(agentId: string) {
    this.router.navigateByUrl(`/?agentId=${encodeURIComponent(agentId)}`)
  }
  
  create(registrationId: string) {
    this.selectedAgent$?.pipe(
      filter(agent => !!agent),
      take(1),
    )
    .subscribe(agent => {
      this.router.navigateByUrl(`/project-create?agentId=${encodeURIComponent(agent.id)}&registrationId=${encodeURIComponent(registrationId)}`)
    });
  }

  projectsForRegistration(registrationId: string): Observable<Project[]> {
    return this.selectedAgent$?.pipe(
      switchMap(agent => this.store.select(selectProjects(agent.id, registrationId)))
    ) || of([])
  }

  ngOnInit(): void {
    this.selectedAgent$ = this.route.queryParams.pipe(
      map(params => decodeURIComponent(params['agentId'])),
      switchMap(agentId => this.store.select(selectAgent(agentId))),
    );
    this.registrations$ = this.selectedAgent$.pipe(
      tap(agent => this.store.dispatch(loadProjects({ ownerId: agent.id }))),
      switchMap(agent => this.store.select(selectRegistrations(agent.id)))
    )
  }
}
