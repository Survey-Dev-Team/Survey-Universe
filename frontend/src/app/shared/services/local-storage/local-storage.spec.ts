import { TestBed } from '@angular/core/testing';
import { LocalStorageService, WINDOW } from './local-storage';
import { ReservationData } from '../../models/interfaces';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let mockWindow: jasmine.SpyObj<Window>;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    mockLocalStorage = {};

    const windowSpy = {
      localStorage: {
        getItem: jasmine.createSpy('getItem').and.callFake((key: string) => mockLocalStorage[key] || null),
        setItem: jasmine.createSpy('setItem').and.callFake((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: jasmine.createSpy('removeItem').and.callFake((key: string) => {
          delete mockLocalStorage[key];
        }),
      }
    } as unknown as jasmine.SpyObj<Window>;

    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        { provide: WINDOW, useValue: windowSpy }
      ]
    });

    service = TestBed.inject(LocalStorageService);
    mockWindow = TestBed.inject(WINDOW) as jasmine.SpyObj<Window>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Token Management', () => {
    it('should set token in localStorage and signal', () => {
      const testToken = 'test-token-123';
      
      service.setToken(testToken);
      
      expect(service.token()).toBe(testToken);
      expect(mockWindow.localStorage.setItem).toHaveBeenCalledWith('SESSION_TOKEN', testToken);
    });

    it('should get token from localStorage', () => {
      mockLocalStorage['SESSION_TOKEN'] = 'stored-token';
      
      const token = service.getToken();
      
      expect(token).toBe('stored-token');
      expect(mockWindow.localStorage.getItem).toHaveBeenCalledWith('SESSION_TOKEN');
    });

    it('should return null when token does not exist', () => {
      const token = service.getToken();
      
      expect(token).toBeNull();
    });

    it('should delete token from localStorage', () => {
      mockLocalStorage['SESSION_TOKEN'] = 'token-to-delete';
      
      service.deleteToken();
      
      expect(mockWindow.localStorage.removeItem).toHaveBeenCalledWith('SESSION_TOKEN');
      expect(mockLocalStorage['SESSION_TOKEN']).toBeUndefined();
    });

    it('should return true when token exists', () => {
      mockLocalStorage['SESSION_TOKEN'] = 'existing-token';
      
      expect(service.hasToken()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      expect(service.hasToken()).toBe(false);
    });
  });

  describe('Preorder Page Management', () => {
    it('should set isPreorderPage flag', () => {
      service.setIsPreorderPage(true);
      
      expect(service.isPreorderPage()).toBe(true);
      expect(mockWindow.localStorage.setItem).toHaveBeenCalledWith('isPreorderPage', 'true');
    });

    it('should get isPreorderPage flag as true', () => {
      mockLocalStorage['isPreorderPage'] = 'true';
      
      const result = service.getIsPreorderPage();
      
      expect(result).toBe(true);
    });

    it('should get isPreorderPage flag as false when stored as false', () => {
      mockLocalStorage['isPreorderPage'] = 'false';
      
      const result = service.getIsPreorderPage();
      
      expect(result).toBe(false);
    });

    it('should get isPreorderPage flag as false when not stored', () => {
      const result = service.getIsPreorderPage();
      
      expect(result).toBe(false);
    });
  });

  describe('Reservation Data Management', () => {
    const mockReservationData: ReservationData = {
      location: 'Test Location',
      tableNumber: 'Table 5',
      date: '2025-11-24',
      timeslot: '18:00',
      reservationId: 'res-123'
    };

    it('should set reservation data', () => {
      service.setReservationData(mockReservationData);
      
      expect(service.reservationData()).toEqual(mockReservationData);
      expect(mockWindow.localStorage.setItem).toHaveBeenCalledWith(
        'reservationData', 
        JSON.stringify(mockReservationData)
      );
    });

    it('should set reservation data to null', () => {
      service.setReservationData(null);
      
      expect(service.reservationData()).toBeNull();
      expect(mockWindow.localStorage.setItem).toHaveBeenCalledWith(
        'reservationData', 
        JSON.stringify(null)
      );
    });

    it('should get reservation data', () => {
      mockLocalStorage['reservationData'] = JSON.stringify(mockReservationData);
      
      const result = service.getReservationData();
      
      expect(result).toEqual(mockReservationData);
    });

    it('should return null when reservation data does not exist', () => {
      const result = service.getReservationData();
      
      expect(result).toBeNull();
    });
  });

  describe('Generic Item Management', () => {
    it('should set item with generic type', () => {
      const testData = { name: 'Test', value: 123 };
      
      service.setItem('testKey', testData);
      
      expect(mockWindow.localStorage.setItem).toHaveBeenCalledWith(
        'testKey',
        JSON.stringify(testData)
      );
    });

    it('should get item with generic type', () => {
      const testData = { name: 'Test', value: 123 };
      mockLocalStorage['testKey'] = JSON.stringify(testData);
      
      const result = service.getItem<typeof testData>('testKey');
      
      expect(result).toEqual(testData);
    });

    it('should return null when getting non-existent item', () => {
      const result = service.getItem('nonExistentKey');
      
      expect(result).toBeNull();
    });

    it('should remove item', () => {
      mockLocalStorage['keyToRemove'] = 'value';
      
      service.removeItem('keyToRemove');
      
      expect(mockWindow.localStorage.removeItem).toHaveBeenCalledWith('keyToRemove');
      expect(mockLocalStorage['keyToRemove']).toBeUndefined();
    });
  });
});
