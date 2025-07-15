import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [
        ReactiveFormsModule,     
        HttpClientTestingModule, 
        RouterTestingModule      
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize profile form', () => {
    expect(component.profileForm).toBeDefined();
    expect(component.profileForm.get('firstName')).toBeDefined();
    expect(component.profileForm.get('lastName')).toBeDefined();
    expect(component.profileForm.get('email')).toBeDefined();
  });

  it('should validate required fields', () => {
    const firstNameControl = component.profileForm.get('firstName');
    const lastNameControl = component.profileForm.get('lastName');
    const emailControl = component.profileForm.get('email');

    firstNameControl?.setValue('');
    lastNameControl?.setValue('');
    emailControl?.setValue('');

    expect(firstNameControl?.valid).toBeFalsy();
    expect(lastNameControl?.valid).toBeFalsy();
    expect(emailControl?.valid).toBeFalsy();
  });

  it('should validate email format', () => {
    const emailControl = component.profileForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.errors?.['email']).toBeTruthy();
  });

  it('should accept valid form data', () => {
    component.profileForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    });

    expect(component.profileForm.valid).toBeTruthy();
  });
});