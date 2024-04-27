import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  constructor(private apiService: ApiService) {}

  @Input() currentPage$: any;
  @Input() pages!: number;
  
  nextPage() {//left arrow
    this.currentPage$.next(this.currentPage$.value + 1);
  }

  previousPage() {//right arrow
    if (this.currentPage$.value > 1) {
      this.currentPage$.next(this.currentPage$.value - 1);
    }
  }
}