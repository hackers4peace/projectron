import { TestBed } from '@angular/core/testing';

import { SaiService } from './sai.service';

describe('SaiService', () => {
  let service: SaiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
