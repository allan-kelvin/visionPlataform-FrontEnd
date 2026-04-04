import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-version-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './version-details.html',
  styleUrl: './version-details.scss'
})
export class VersionDetailsComponent {
  @Input() version: any;
}
