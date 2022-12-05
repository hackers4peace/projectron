import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { DataEffects } from './data.effects';

describe('DataEffects', () => {
  let actions$: Observable<any>;
  let effects: DataEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(DataEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
