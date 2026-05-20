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
import { UpdateUserData } from '../../models/interfaces';
import { TagModule } from 'primeng/tag';
import { ToastService } from '../../../../shared/services/toast-service/toast-service';
import { UsersService } from '../../../../shared/services/users/users.service';

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
  usersService = inject(UsersService);
  toastService = inject(ToastService);
  private revision = signal<string>('1');
  inputType = InputType;
  buttonText = ButtonText;
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
    const urlId = this.userStoreService.getUser()?.urlId;
    if (!urlId) return;

    this.usersService.getUserDetails(urlId).subscribe(details => {
      this.revision.set(details.revision);
      this.currentUserData.set({
        imageUrl: details.userSummary.profileImage,
        firstName: details.userSummary.firstName,
        lastName: details.userSummary.lastName,
        role: details.userSummary.role as UpdateUserData['role'],
        email: details.userSummary.email,
      });
    });
  }

  getUserData() {
    const stored = this.userStoreService.getUser();
    if (stored) {
      this.currentUserData.set({
        imageUrl: stored.profileImage,
        firstName: stored.firstName,
        lastName: stored.lastName,
        role: stored.role as UpdateUserData['role'],
        email: stored.email,
      });
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

      this.updateUserDataForm.patchValue({ base64encodedImage: result });
    };

    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.updateUserDataForm.invalid) {
      this.updateUserDataForm.markAllAsTouched();
      return;
    }

    const urlId = this.userStoreService.getUser()?.urlId;
    if (!urlId) return;

    const { firstName, lastName, base64encodedImage } = this.updateUserDataForm.value;

    this.usersService.updateUser(urlId, {
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
      profileImage: base64encodedImage ?? undefined,
      revision: this.revision(),
    }, (details) => {
      this.revision.set(details.revision);
      this.fileUpload.clear();
      this.updateUserDataForm.patchValue({ base64encodedImage: null });
      this.currentUserData.set({
        imageUrl: details.userSummary.profileImage,
        firstName: details.userSummary.firstName,
        lastName: details.userSummary.lastName,
        role: details.userSummary.role as UpdateUserData['role'],
        email: details.userSummary.email,
      });
    });
  }
}
