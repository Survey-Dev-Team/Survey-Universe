import { Component, signal } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'gt-contact-page',
  imports: [Header, Footer],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.scss',
})
export class ContactPage {
  readonly videoEnded = signal(false);

  onVideoEnded(): void {
    this.videoEnded.set(true);
  }
}
