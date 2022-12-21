import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadMyProjects } from 'src/app/actions/data.actions';
import { selectMyProjects } from 'src/app/selectors/data.selector';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  projects$ = this.store.select(selectMyProjects)

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(loadMyProjects());
  }
}
