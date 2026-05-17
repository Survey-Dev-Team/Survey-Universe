import { 
  Component, 
  computed, 
  effect, 
  inject, 
  OnInit, 
  signal, 
  ViewChild 
} from '@angular/core';
import { 
  ReactiveFormsModule, 
  Validators, 
  FormBuilder 
} from '@angular/forms';
import { 
  FileUpload, 
  FileUploadModule 
} from 'primeng/fileupload';
import { Input } from '../../../../shared/components/input/input';
import { InputType } from '../../../../shared/components/input/models/input.model';
import { ButtonText } from '../../../../shared/models/buttons.constants';
import { UserStoreService } from '../../../../shared/services/user-store-service/user-store-service';
import { 
  UpdateUserData
} from '../../models/interfaces';
import { TagModule } from 'primeng/tag';
import { ToastService } from '../../../../shared/services/toast-service/toast-service';

@Component({
  selector: 'gt-update-user-data-form',
  imports: [
    Input, 
    ReactiveFormsModule, 
    FileUploadModule, 
    TagModule
  ],
  templateUrl: './update-user-data-form.html',
  styleUrl: './update-user-data-form.scss',
})
export class UpdateUserDataForm implements Validators, OnInit {
  @ViewChild(FileUpload) fileUpload!: FileUpload;
  fb = inject(FormBuilder);
  userStoreService = inject(UserStoreService);
  toastService = inject(ToastService);
  inputType = InputType;
  buttonText = ButtonText;
  previewUrl: string | null = null;
  base64Image: string | null = null;
  currentUserData = signal<UpdateUserData>({
    firstName: '',
    lastName: '',
    imageUrl: '',
    role: 'CUSTOMER',
    email: ''
  });

  currentUser = computed(() => this.userStoreService.getUser());
  currentUserRole = computed(() => {
    const user = this.currentUserData();
    if (!user?.role) return '';
    return user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();
  });

  updateUserDataForm = this.fb.group({
    base64encodedImage: [this.base64Image ?? null],
    firstName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z'-]+$/),
      ],
    ],
    lastName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z'-]+$/),
      ],
    ],
  });

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    const stored = this.userStoreService.getUser();
    if (stored) {
      this.currentUserData.set(stored);
    }
  }

  constructor() {
    effect(() => {
      this.updateUserDataForm.get('lastName')?.setValue(this.currentUserData().lastName);
      this.updateUserDataForm.get('firstName')?.setValue(this.currentUserData().firstName);
    });
  }

  onSelect(event: { files: File[] }): void {
    const file = event.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [, base64] = result.split(',') ?? null;

      this.updateUserDataForm.patchValue({ base64encodedImage: base64 });
    };

    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.updateUserDataForm.invalid) {
      this.updateUserDataForm.markAllAsTouched();
      return;
    }

    this.toastService.showToast({
        severity: 'info',
        message: 'Info',
        detail: 'Profile update is not yet implemented.',
        life: 3000,
      });
    return;
  }
}
