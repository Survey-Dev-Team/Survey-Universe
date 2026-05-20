import { Component, input, output, OnInit, DestroyRef, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'gt-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnInit {
  placeholder = input<string>('Search…');
  variant = input<'default' | 'hero'>('default');
  queryChange = output<string>();

  readonly form = new FormGroup({
    query: new FormControl(''),
  });

  get control() {
    return this.form.controls.query;
  }

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.control.valueChanges.pipe(
      debounceTime(300),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(value => this.queryChange.emit(value ?? ''));
  }

  submit(): void {
    this.queryChange.emit(this.control.value ?? '');
  }

  clear(): void {
    this.control.setValue('', { emitEvent: false });
    this.queryChange.emit('');
  }
}
