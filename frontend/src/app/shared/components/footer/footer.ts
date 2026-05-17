import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROUTES } from '../../models/routes.constants';

@Component({
  selector: 'gt-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly routes = ROUTES;
  protected readonly year = new Date().getFullYear();
}
