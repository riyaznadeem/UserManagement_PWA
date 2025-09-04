import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { LanguageService } from '../../services/language.service';
import { PaginationComponent } from "../../shared/pagination/pagination.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {
  private  readonly _userService = inject(UserService);
  private readonly _toast = inject(ToastService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly language = inject(LanguageService);
  public readonly _authService = inject(AuthService);

  users: any[] = [];
  roles: any[] = [];
  userForm!: FormGroup;
  isEditMode = false;
  currentUsername!: string;
  pageNumber = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages: number[] = [];

  searchTerm = '';
  roleFilter: string | null = null;
  loading = false;

  sortBy = 'Username';
  sortDirection: 'asc' | 'desc' = 'asc';

  readonly accessRole = localStorage.getItem('role');

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
    this.loadRoles();
     const token = this._authService.getDecodedToken();
  this.currentUsername = token['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  }

  initForm(user: any = null) {
    this.userForm = this._formBuilder.group({
      username: [
        { value: user?.username || '', disabled: this.accessRole !== 'Admin' },
        Validators.required,
      ],
      displayName: [user?.displayName || '', Validators.required],
      password: [
        user?.password || '',
        this.isEditMode ? [] : Validators.required,
      ],
      roleId: [
        { value: user?.roleId || '', disabled: this.accessRole !== 'Admin' },
        Validators.required,
      ],
    });
  }

  private loadRoles() {
    this._userService.getRoleList().subscribe({
      next: (res) => (this.roles = res),
      error: () =>
        this._toast.show('Failed to load roles', {
          classname: 'bg-danger text-light',
        }),
    });
  }

  get isCurrentUser():boolean {
    const isCurrent = false;
    this.users.forEach(u => {

    })
    return true;
  }

  loadUsers() {
    this.loading = true;
    const requestBody = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      userNameOrDisplayName: this.searchTerm || null,
      role: this.roleFilter || null,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
    };

    this._userService.getUserList(requestBody).subscribe({
      next: (res) => {
        this.users = res.items;
        this.totalCount = res.totalCount;
        this.pageNumber = res.pageNumber;
        this.pageSize = res.pageSize;

        const pageCount = Math.ceil(this.totalCount / this.pageSize);
        this.totalPages = Array.from({ length: pageCount }, (_, i) => i + 1);

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this._toast.show('Failed to load users', {
          classname: 'bg-danger text-light',
        });
      },
    });
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages.length) {
      this.pageNumber = page;
      this.loadUsers();
    }
  }

  onSort(column: string) {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.onSearch();
  }

  onSearch() {
    this.pageNumber = 1;
    this.loadUsers();
  }

  openAddUser() {
    this.isEditMode = false;
    this.initForm();
  }

  openEditUser(user: any) {
    this.isEditMode = true;
    this.initForm(user);
  }

  saveUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.getRawValue();

    if (this.isEditMode) {
      if (this.accessRole === 'Admin') {
        this._userService.updateUser(formValue).subscribe({
          next: () =>
            this.afterSave(this.translate('userManagement.userUpdated')),
          error: () =>
            this.toastError(this.translate('userManagement.updateFailed')),
        });
      } else if (this.accessRole === 'User') {
        this._userService
          .updateOwn({ displayName: formValue.displayName })
          .subscribe({
            next: () =>
              this.afterSave(this.translate('userManagement.profileUpdated')),
            error: () =>
              this.toastError(this.translate('userManagement.updateFailed')),
          });
      }
    } else {
      this._userService.createUser(formValue).subscribe({
        next: () =>
          this.afterSave(this.translate('userManagement.userCreated')),
        error: () =>
          this.toastError(this.translate('userManagement.creationFailed')),
      });
    }
  }

  private afterSave(message: string) {
    this._toast.show(message);
    this.refreshData();
    this.hideModal();
  }

  private toastError(message: string) {
    this._toast.show(message, {
      classname: 'bg-danger text-light',
      delay: 5000,
    });
  }

  hideModal() {
    const modalElement = document.getElementById('addEditUserModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }

  refreshData() {
    this.onSearch();
  }

  confirmDeleteUser(user: any) {
    if (
      confirm(
        this.translate('userManagement.confirmDelete').replace(
          '{username}',
          user.username
        )
      )
    ) {
      this._userService.deleteUser(user.id).subscribe({
        next: () => {
          this._toast.show(this.translate('userManagement.deleteSuccess'));
          this.refreshData();
        },
        error: () =>
          this.toastError(this.translate('userManagement.deleteFailed')),
      });
    }
  }

  get translate() {
    return this.language.translate.bind(this.language);
  }

  canEditUser(user: any): boolean {
  return user.username !== this.currentUsername;
}
}
declare var bootstrap: any;
