import { Component } from '@angular/core';
import { CtaBand } from '../../shared/cta-band/cta-band';
import { Compare } from '../../shared/compare/compare';
import { PhotoImg } from '../../shared/photo';
import { Reveal } from '../../shared/reveal';
import { CASES, PROJECTS } from '../../site';

@Component({
  selector: 'app-projects',
  imports: [CtaBand, Reveal, Compare, PhotoImg],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  protected readonly cases = CASES;
  protected readonly projects = PROJECTS;
}
