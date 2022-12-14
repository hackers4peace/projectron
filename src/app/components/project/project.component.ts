import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { mergeMap, Observable, switchMap } from 'rxjs';
import { Project } from 'src/app/models/project.model';
import { selectProject } from 'src/app/selectors/data.selector';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  project$?: Observable<Project>;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.project$ = this.route.queryParams.pipe(
      mergeMap(params =>  this.store.select(selectProject(params['id'])))
    );
  }
}
