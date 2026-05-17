import { 
  Component, 
  input 
} from '@angular/core';

@Component({
  selector: 'gt-page-header-role',
  standalone: true,
  imports: [],
  templateUrl: './page-header-role.html',
  styleUrl: './page-header-role.scss'
})
export class PageHeaderRole {
  title = input<string>();
  backgroundImage = input<string>('');
  centered = input<boolean>(false);
}
