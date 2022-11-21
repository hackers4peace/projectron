import { TestBed } from '@angular/core/testing';

import { AuthnService } from './authn.service';

describe('AuthnService', () => {
  let service: AuthnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
