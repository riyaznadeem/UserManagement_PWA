import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
 @Input() currentPage: number = 1;
  @Input() totalPages: number[] = [];
  private readonly language = inject(LanguageService);

  @Output() pageChange = new EventEmitter<number>();

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages.length && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

    get translate() {
    return this.language.translate.bind(this.language);
  }
}
