import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  readonly cartCount = signal(0);

  loadCartCount(): void {
    // Placeholder for copied auth flow dependency.
    this.cartCount.set(this.cartCount());
  }

  clearCart(): void {
    this.cartCount.set(0);
  }
}
