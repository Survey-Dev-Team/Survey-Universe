import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent } from './select';
import { FormsModule } from '@angular/forms';
import { LabeledOption } from '../../models/interfaces';

describe('Select', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('options', []);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should accept placeholder input', () => {
      fixture.componentRef.setInput('options', []);
      fixture.componentRef.setInput('placeholder', 'Choose option');
      fixture.detectChanges();
      expect(component.placeholder()).toBe('Choose option');
    });

    it('should have default placeholder', () => {
      fixture.componentRef.setInput('options', []);
      fixture.detectChanges();
      expect(component.placeholder()).toBe('Select');
    });

    it('should accept string array options', () => {
      const options = ['Option 1', 'Option 2', 'Option 3'];
      fixture.componentRef.setInput('options', options);
      fixture.detectChanges();
      expect(component.options()).toEqual(options);
    });

    it('should accept objects with id/name shape', () => {
      const options: { id: string; name: string }[] = [
        { id: '1', name: 'Location 1' },
        { id: '2', name: 'Location 2' }
      ];
      fixture.componentRef.setInput('options', options);
      fixture.detectChanges();
      expect(component.options()).toEqual(options);
    });

    it('should accept objects with id/name table shape', () => {
      const options: { id: string; name: string }[] = [
        { id: '1', name: 'Table 1' },
        { id: '2', name: 'Table 2' }
      ];
      fixture.componentRef.setInput('options', options);
      fixture.detectChanges();
      expect(component.options()).toEqual(options);
    });

    it('should accept LabeledOption array', () => {
      const options: LabeledOption[] = [
        { value: '1', label: 'Label 1' },
        { value: '2', label: 'Label 2' }
      ];
      fixture.componentRef.setInput('options', options);
      fixture.detectChanges();
      expect(component.options()).toEqual(options);
    });

    it('should accept icon input', () => {
      fixture.componentRef.setInput('options', []);
      fixture.componentRef.setInput('icon', 'icon.svg');
      fixture.detectChanges();
      expect(component.icon()).toBe('icon.svg');
    });

    it('should accept styleClass input', () => {
      fixture.componentRef.setInput('options', []);
      fixture.componentRef.setInput('styleClass', 'custom-class');
      fixture.detectChanges();
      expect(component.styleClass()).toBe('custom-class');
    });

    it('should accept optionLabel input', () => {
      fixture.componentRef.setInput('options', []);
      fixture.componentRef.setInput('optionLabel', 'name');
      fixture.detectChanges();
      expect(component.optionLabel()).toBe('name');
    });

    it('should have default optionLabel', () => {
      fixture.componentRef.setInput('options', []);
      fixture.detectChanges();
      expect(component.optionLabel()).toBe('address');
    });

    it('should accept optionValue input', () => {
      fixture.componentRef.setInput('options', []);
      fixture.componentRef.setInput('optionValue', 'key');
      fixture.detectChanges();
      expect(component.optionValue()).toBe('key');
    });

    it('should have default optionValue', () => {
      fixture.componentRef.setInput('options', []);
      fixture.detectChanges();
      expect(component.optionValue()).toBe('id');
    });

    it('should accept filter input', () => {
      fixture.componentRef.setInput('options', []);
      fixture.componentRef.setInput('filter', true);
      fixture.detectChanges();
      expect(component.filter()).toBe(true);
    });

    it('should have default filter as false', () => {
      fixture.componentRef.setInput('options', []);
      fixture.detectChanges();
      expect(component.filter()).toBe(false);
    });

    it('should accept filterBy input', () => {
      fixture.componentRef.setInput('options', []);
      fixture.componentRef.setInput('filterBy', 'name');
      fixture.detectChanges();
      expect(component.filterBy()).toBe('name');
    });

    it('should accept showClear input', () => {
      fixture.componentRef.setInput('options', []);
      fixture.componentRef.setInput('showClear', true);
      fixture.detectChanges();
      expect(component.showClear()).toBe(true);
    });

    it('should accept editable input', () => {
      fixture.componentRef.setInput('options', []);
      fixture.componentRef.setInput('editable', true);
      fixture.detectChanges();
      expect(component.editable()).toBe(true);
    });
  });

  describe('value property', () => {
    it('should initialize value as null', () => {
      expect(component.value).toBeNull();
    });

    it('should allow setting value', () => {
      component.value = 'option1';
      expect(component.value).toBe('option1');
    });
  });

  describe('disabled property', () => {
    it('should initialize disabled as false', () => {
      expect(component.disabled).toBe(false);
    });
  });

  describe('isStringArray', () => {
    it('should return true for string array', () => {
      fixture.componentRef.setInput('options', ['Option 1', 'Option 2']);
      fixture.detectChanges();
      expect(component.isStringArray()).toBe(true);
    });

    it('should return true for empty array', () => {
      fixture.componentRef.setInput('options', []);
      fixture.detectChanges();
      expect(component.isStringArray()).toBe(true);
    });

    it('should return false for object array', () => {
      const options: LocationSelectOptions[] = [
        { id: '1', name: 'Location 1' }
      ];
      fixture.componentRef.setInput('options', options);
      fixture.detectChanges();
      expect(component.isStringArray()).toBe(false);
    });

    it('should return false for LabeledOption array', () => {
      const options: LabeledOption[] = [
        { value: '1', label: 'Label 1' }
      ];
      fixture.componentRef.setInput('options', options);
      fixture.detectChanges();
      expect(component.isStringArray()).toBe(false);
    });
  });

  describe('ControlValueAccessor implementation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('options', ['Option 1', 'Option 2']);
      fixture.detectChanges();
    });

    describe('writeValue', () => {
      it('should set value when called with a string', () => {
        component.writeValue('test-value');
        expect(component.value).toBe('test-value');
      });

      it('should set value to null when called with null', () => {
        component.writeValue(null);
        expect(component.value).toBeNull();
      });

      it('should set value to null when called with undefined', () => {
        component.writeValue(undefined as any);
        expect(component.value).toBeNull();
      });
    });

    describe('registerOnChange', () => {
      it('should register onChange callback', () => {
        const onChangeFn = jasmine.createSpy('onChange');
        component.registerOnChange(onChangeFn);
        
        component.handleChange('value');
        
        expect(onChangeFn).toHaveBeenCalledWith('value');
      });

      it('should call onChange with null', () => {
        const onChangeFn = jasmine.createSpy('onChange');
        component.registerOnChange(onChangeFn);
        
        component.handleChange(null);
        
        expect(onChangeFn).toHaveBeenCalledWith(null);
      });
    });

    describe('registerOnTouched', () => {
      it('should register onTouched callback', () => {
        const onTouchedFn = jasmine.createSpy('onTouched');
        component.registerOnTouched(onTouchedFn);
        
        component.markTouched();
        
        expect(onTouchedFn).toHaveBeenCalled();
      });
    });

    describe('setDisabledState', () => {
      it('should set disabled to true', () => {
        component.setDisabledState(true);
        expect(component.disabled).toBe(true);
      });

      it('should set disabled to false', () => {
        component.disabled = true;
        component.setDisabledState(false);
        expect(component.disabled).toBe(false);
      });

      it('should convert truthy values to true', () => {
        component.setDisabledState('yes' as any);
        expect(component.disabled).toBe(true);
      });

      it('should convert falsy values to false', () => {
        component.setDisabledState(0 as any);
        expect(component.disabled).toBe(false);
      });
    });
  });

  describe('handleChange', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('options', ['Option 1', 'Option 2']);
      fixture.detectChanges();
    });

    it('should update value and call onChange', () => {
      const onChangeFn = jasmine.createSpy('onChange');
      component.registerOnChange(onChangeFn);
      
      component.handleChange('selected-value');
      
      expect(component.value).toBe('selected-value');
      expect(onChangeFn).toHaveBeenCalledWith('selected-value');
    });

    it('should handle null value', () => {
      const onChangeFn = jasmine.createSpy('onChange');
      component.registerOnChange(onChangeFn);
      
      component.handleChange(null);
      
      expect(component.value).toBeNull();
      expect(onChangeFn).toHaveBeenCalledWith(null);
    });

    it('should handle undefined as null', () => {
      const onChangeFn = jasmine.createSpy('onChange');
      component.registerOnChange(onChangeFn);
      
      component.handleChange(undefined as any);
      
      expect(component.value).toBeNull();
      expect(onChangeFn).toHaveBeenCalledWith(null);
    });
  });

  describe('markTouched', () => {
    it('should call onTouched callback', () => {
      const onTouchedFn = jasmine.createSpy('onTouched');
      component.registerOnTouched(onTouchedFn);
      
      component.markTouched();
      
      expect(onTouchedFn).toHaveBeenCalled();
    });
  });
});
