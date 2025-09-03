import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {
  private readonly _userService = inject(UserService);
  private readonly _toast = inject(ToastService);
 private readonly _formBuilder = inject(FormBuilder);
  users: any[] = [];
  roles: any[] = [];
  userForm!: FormGroup;
  isEditMode = false;

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
  }

  initForm(user: any = null) {
    this.userForm = this._formBuilder.group({
      username: [{ value: user?.username || '', disabled: this.accessRole !== 'Admin' }, Validators.required],
      displayName: [user?.displayName || '', Validators.required],
      password: [user?.password || '', this.isEditMode ? [] : Validators.required],
      roleId: [{ value: user?.roleId || '', disabled: this.accessRole !== 'Admin' }, Validators.required],
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
        // assuming you have user id somewhere, maybe formValue includes it or you can pass it separately
        this._userService.updateUser(formValue).subscribe({
          next: () => this.afterSave('User updated successfully'),
          error: () => this.toastError('Update failed'),
        });
      } else if (this.accessRole === 'User') {
        this._userService.updateOwn({ displayName: formValue.displayName }).subscribe({
          next: () => this.afterSave('Profile updated'),
          error: () => this.toastError('Update failed'),
        });
      }
    } else {
      this._userService.createUser(formValue).subscribe({
        next: () => this.afterSave('User created successfully'),
        error: () => this.toastError('Creation failed'),
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
    if (confirm(`Are you sure you want to delete ${user.username}?`)) {
      this._userService.deleteUser(user.id).subscribe({
        next: () => {
          this._toast.show('Delete success!');
          this.refreshData();
        },
        error: () => this.toastError('Delete failed'),
      });
    }
  }
}
declare var bootstrap: any;
