import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthnRedirectComponent } from './authn-redirect.component';

describe('AuthnRedirectComponent', () => {
  let component: AuthnRedirectComponent;
  let fixture: ComponentFixture<AuthnRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthnRedirectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthnRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
