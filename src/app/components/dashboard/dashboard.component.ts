import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { Store } from '@ngrx/store';
import { filter, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { loadProjects } from 'src/app/actions/data.actions';
import { Agent } from 'src/app/models/agent.model';
import { Project } from 'src/app/models/project.model';
import { Registration } from 'src/app/models/registration.model';
import { selectAgent, selectAgents, selectProjects, selectRegistrations } from 'src/app/selectors/data.selector';
import { SaiService } from 'src/app/services/sai.service';


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
  cat?: Promise<SafeUrl>
  calendar?: Promise<SafeUrl>

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private sai: SaiService,
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
    this.cat = this.sai.dataUrl('http://localhost:3000/alice-work/dataRegistry/images/cat')
    this.calendar = this.sai.dataUrl('http://localhost:3000/alice-work/dataRegistry/calendars/solid-interop')
  }
}
