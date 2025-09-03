import { Injectable } from '@angular/core';

type Language = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  language: { code: Language } = { code: 'en' };
  private translationsFromJson: Record<string, string> = {};

  private readonly translations: Record<Language, Record<string, string>> = {
    en: {
      'login.title': 'Login',
      'login.username': 'Username',
      'login.password': 'Password',
      'login.button': 'Login',
      'login.success': '✅ Login successful!',
      'login.failed': '❌ Login failed. Please check your credentials.',
      'login.username_error': 'Username must be at least 3 characters.',
      'login.password_error': 'Password must be at least 6 characters.',
      'app.title': 'User Management',
      'nav.dashboard': 'Dashboard',
      'nav.users': 'User Management',
      'nav.audit': 'Audit Logs',
      'nav.logout': 'Logout',
      'dashboard.welcome': 'Welcome',
      'dashboard.message': 'You are now in the dashboard.',
      "dashboard.adminMessage": " You can manage users, roles, and system settings.",
      "dashboard.userMessage": "You can manage your profile and explore features.",
      "dashboard.readOnlyMessage": "You have read-only access to reports and data.",
      'userManagement.title': 'User Management',
      'userManagement.search': 'Search',
      'userManagement.searchPlaceholder': 'Search by username or display name',
      'userManagement.allRoles': 'All Roles',
      'userManagement.username': 'Username',
      'userManagement.displayName': 'Display Name',
      'userManagement.role': 'Role',
      'userManagement.action': 'Action',
      'userManagement.edit': 'Edit',
      'userManagement.delete': 'Delete',
      'userManagement.addUser': '+ Add User',
      'userManagement.create': 'Create',
      'userManagement.update': 'Update',
      'userManagement.cancel': 'Cancel',
      'userManagement.selectRole': 'Select Role',
      'userManagement.password': 'Password',
      'userManagement.usernameRequired': 'Username is required.',
      'userManagement.displayNameRequired': 'Display Name is required.',
      'userManagement.passwordRequired': 'Password is required.',
      'userManagement.roleRequired': 'Role is required.',
      'userManagement.previous': 'Previous',
      'userManagement.next': 'Next',
      'userManagement.userUpdated': 'User updated successfully',
      'userManagement.updateFailed': 'Update failed',
      'userManagement.profileUpdated': 'Profile updated',
      'userManagement.userCreated': 'User created successfully',
      'userManagement.creationFailed': 'Creation failed',
      'userManagement.confirmDelete':
        'Are you sure you want to delete {username}?',
      'userManagement.deleteSuccess': 'Delete success!',
      'userManagement.deleteFailed': 'Delete failed',
    },
    ar: {
      'login.title': 'تسجيل الدخول',
      'login.username': 'اسم المستخدم',
      'login.password': 'كلمة المرور',
      'login.button': 'دخول',
      'login.success': '✅ تم تسجيل الدخول بنجاح!',
      'login.failed': '❌ فشل تسجيل الدخول. تحقق من البيانات.',
      'login.username_error': 'يجب أن يكون اسم المستخدم 3 أحرف على الأقل.',
      'login.password_error': 'يجب أن تكون كلمة المرور 6 أحرف على الأقل.',
      'app.title': 'إدارة المستخدمين',
      'nav.dashboard': 'لوحة القيادة',
      'nav.users': 'إدارة المستخدمين',
      'nav.audit': 'سجلات التدقيق',
      'nav.logout': 'تسجيل الخروج',
      'dashboard.welcome': 'مرحباً',
      'dashboard.message': 'أنت الآن في لوحة القيادة.',
      "dashboard.adminMessage": "يمكنك إدارة المستخدمين، الأدوار، وإعدادات النظام.",
      "dashboard.userMessage": "يمكنك إدارة ملفك الشخصي واستكشاف المزايا.",
      "dashboard.readOnlyMessage": "لديك صلاحيات قراءة فقط للوصول إلى البيانات والتقارير.",
      'userManagement.title': 'إدارة المستخدمين',
      'userManagement.search': 'بحث',
      'userManagement.searchPlaceholder': 'ابحث باسم المستخدم أو اسم العرض',
      'userManagement.allRoles': 'كل الأدوار',
      'userManagement.username': 'اسم المستخدم',
      'userManagement.displayName': 'اسم العرض',
      'userManagement.role': 'الدور',
      'userManagement.action': 'الإجراء',
      'userManagement.edit': 'تعديل',
      'userManagement.delete': 'حذف',
      'userManagement.addUser': '+ إضافة مستخدم',
      'userManagement.create': 'إنشاء',
      'userManagement.update': 'تحديث',
      'userManagement.cancel': 'إلغاء',
      'userManagement.selectRole': 'اختر الدور',
      'userManagement.password': 'كلمة المرور',
      'userManagement.usernameRequired': 'اسم المستخدم مطلوب.',
      'userManagement.displayNameRequired': 'اسم العرض مطلوب.',
      'userManagement.passwordRequired': 'كلمة المرور مطلوبة.',
      'userManagement.roleRequired': 'الدور مطلوب.',
      'userManagement.previous': 'السابق',
      'userManagement.next': 'التالي',
      'userManagement.userUpdated': 'تم تحديث المستخدم بنجاح',
      'userManagement.updateFailed': 'فشل التحديث',
      'userManagement.profileUpdated': 'تم تحديث الملف الشخصي',
      'userManagement.userCreated': 'تم إنشاء المستخدم بنجاح',
      'userManagement.creationFailed': 'فشل الإنشاء',
      'userManagement.confirmDelete': 'هل أنت متأكد أنك تريد حذف {username}؟',
      'userManagement.deleteSuccess': 'تم الحذف بنجاح!',
      'userManagement.deleteFailed': 'فشل الحذف',
    },
  };

  toggleLanguage() {
    this.language.code = this.language.code === 'en' ? 'ar' : 'en';
    document.documentElement.dir = this.language.code === 'ar' ? 'rtl' : 'ltr';
  }

  translate(key: string): string {
    return this.translations[this.language.code][key] || key;
  }

  // constructor(private http: HttpClient) {
  //   this.loadTranslations(this.language);
  // }

  // async loadTranslations(lang: Language) {
  //   try {
  //     this.translations = await this.http
  //       .get<Record<string, string>>(`assets/i18n/${lang}.json`)
  //       .toPromise();
  //     this.language = lang;
  //     document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  //   } catch (error) {
  //     console.error('Failed to load translation file:', error);
  //     this.translations = {};
  //   }
  // }

  // toggleLanguage() {
  //   const newLang: Language = this.language === 'en' ? 'ar' : 'en';
  //   this.loadTranslations(newLang);
  // }

  // translate(key: string, params?: Record<string, string>): string {
  //   let translation = this.translations[key] || key;

  //   if (params) {
  //     Object.keys(params).forEach((paramKey) => {
  //       const regex = new RegExp(`{${paramKey}}`, 'g');
  //       translation = translation.replace(regex, params[paramKey]);
  //     });
  //   }

  //   return translation;
  // }
}
