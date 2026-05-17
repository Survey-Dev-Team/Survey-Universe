import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZoneChangeDetection, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { UserProfile } from './user-profile';
import { UserStoreService } from '../../shared/services/user-store-service/user-store-service';
import { AuthService } from '../../shared/services/auth-service/auth-service';

describe('UserProfile', () => {
  let component: UserProfile;
  let fixture: ComponentFixture<UserProfile>;
  let userStoreService: jasmine.SpyObj<UserStoreService>;

  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@test.com',
    role: 'CUSTOMER' as const,
    imageUrl: 'https://example.com/image.jpg'
  };

  beforeEach(async () => {
    const userStoreServiceSpy = jasmine.createSpyObj('UserStoreService', ['getUser', 'getUserProfile', 'getUserData'], {
      currentUser: signal(mockUser)
    });
    const authServiceSpy = jasmine.createSpyObj('AuthService', {}, {
      isAuthorized: signal(true)
    });

    userStoreServiceSpy.getUser.and.returnValue(mockUser);
    userStoreServiceSpy.getUserProfile.and.returnValue(mockUser);
    userStoreServiceSpy.getUserData.and.returnValue(of(mockUser));

    await TestBed.configureTestingModule({
      imports: [UserProfile],
      providers: [
        provideZoneChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        MessageService,
        { provide: UserStoreService, useValue: userStoreServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfile);
    component = fixture.componentInstance;
    userStoreService = TestBed.inject(UserStoreService) as jasmine.SpyObj<UserStoreService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get current user', () => {
    expect(component.currentUser()).toEqual(mockUser);
  });

  it('should compute current user role', () => {
    expect(component.currentUserRole()).toBe('Customer');
  });

  it('should initialize with general tab active', () => {
    expect(component.activeTab()).toBe('general');
  });

  it('should set active tab to password', () => {
    component.setActiveTab('password');
    expect(component.activeTab()).toBe('password');
  });

  it('should set active tab to general', () => {
    component.activeTab.set('password');
    component.setActiveTab('general');
    expect(component.activeTab()).toBe('general');
  });

  it('should check if user is logged in', () => {
    expect(component.isLoggedIn()).toBe(true);
  });

  it('should initialize hasToken as false by default', () => {
    expect(component.hasToken()).toBe(false);
  });

  it('should have activatedRoute injected', () => {
    expect(component.activatedRoute).toBeDefined();
  });

  it('should have routes constant', () => {
    expect(component.routes).toBeDefined();
  });

  it('should have LoginLinkRoute', () => {
    expect(component.LoginLinkRoute).toBeDefined();
    expect(component.LoginLinkRoute).toContain('login');
  });

  it('should compute currentUserRole with lowercase role', () => {
    const role = component.currentUserRole();
    expect(role).toBe('Customer');
  });

  it('should handle currentUserRole when user is null', () => {
    userStoreService.getUser.and.returnValue(null as any);
    fixture.detectChanges();
    
    expect(component.currentUserRole()).toBe('');
  });

  it('should return empty string for currentUserRole when role is null', () => {
    userStoreService.getUser.and.returnValue({ ...mockUser, role: null as any });
    fixture.detectChanges();
    
    expect(component.currentUserRole()).toBe('');
  });

  it('should set active tab to email', () => {
    component.setActiveTab('email');
    expect(component.activeTab()).toBe('email');
  });

  it('should initialize with hasToken false', () => {
    expect(component.hasToken()).toBe(false);
  });

  it('should have ButtonText constant', () => {
    expect(component['ButtonText']).toBeDefined();
  });

  it('should call userStoreService.getUser', () => {
    component.currentUser();
    expect(userStoreService.getUser).toHaveBeenCalled();
  });

  it('should capitalize role correctly for ADMIN', () => {
    userStoreService.getUser.and.returnValue({ ...mockUser, role: 'ADMIN' as any });
    fixture.detectChanges();
    
    expect(component.currentUserRole()).toBe('Admin');
  });

  it('should capitalize role correctly for WAITER', () => {
    userStoreService.getUser.and.returnValue({ ...mockUser, role: 'WAITER' as any });
    fixture.detectChanges();
    
    expect(component.currentUserRole()).toBe('Waiter');
  });

  it('should handle multiple tab switches', () => {
    component.setActiveTab('password');
    expect(component.activeTab()).toBe('password');
    
    component.setActiveTab('email');
    expect(component.activeTab()).toBe('email');
    
    component.setActiveTab('general');
    expect(component.activeTab()).toBe('general');
  });

  it('should use destroyRef for takeUntilDestroyed', () => {
    expect(component['destroyRef']).toBeDefined();
  });
});
