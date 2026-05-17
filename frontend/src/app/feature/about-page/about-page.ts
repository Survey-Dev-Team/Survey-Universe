import { Component, signal } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'gt-about-page',
  imports: [Header, Footer],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
})
export class AboutPage {
  readonly videoEnded = signal(false);

  onVideoEnded(): void {
    this.videoEnded.set(true);
  }

  readonly team = [
    {
      name: 'Alex Monroe',
      role: 'Co-founder & CEO',
      bio: 'Obsessed with the idea that better questions lead to better decisions. Previously at research firms across Europe.',
    },
    {
      name: 'Lena Oris',
      role: 'Head of Product',
      bio: 'Designs experiences that feel effortless. Believes a good survey is a form of art.',
    },
    {
      name: 'Mark Vega',
      role: 'Lead Engineer',
      bio: 'Builds things that scale. Passionate about open data and privacy-first architecture.',
    },
    {
      name: 'Sofia Lane',
      role: 'Data Scientist',
      bio: 'Turns thousands of responses into stories that actually make sense to humans.',
    },
  ];
}
