import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, mergeMap, Observable, switchMap, tap } from 'rxjs';
import { loadProjects } from 'src/app/actions/data.actions';
import { Agent } from 'src/app/models/agent.model';
import { Project } from 'src/app/models/project.model';
import { selectAgent, selectAgents, selectProjects } from 'src/app/selectors/data.selector';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  agents$ = this.store.select(selectAgents)
  selectedAgent$?: Observable<Agent>
  projects$?: Observable<Project[]> 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) { }

  selectAgent(agentId: string) {
    this.router.navigateByUrl(`/?agentId=${encodeURIComponent(agentId)}`)
  }

  ngOnInit(): void {
    this.selectedAgent$ = this.route.queryParams.pipe(
      map(params => decodeURIComponent(params['agentId'])),
      tap(agentId => this.store.dispatch(loadProjects({ ownerId: agentId }))),
      switchMap(agentId => this.store.select(selectAgent(agentId))),
    );
    this.projects$ = this.selectedAgent$.pipe(
      switchMap(agent => this.store.select(selectProjects(agent.id)))
    )
  }
  
}
