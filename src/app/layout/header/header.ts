import { DOCUMENT } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SERVICES } from '../../site';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class SiteHeader {
  protected readonly services = SERVICES;
  /** Whether the small-screen menu is open. */
  protected readonly open = signal(false);
  /** Whether the "Onze diensten" dropdown is open (wide screens). */
  protected readonly dropdown = signal(false);

  constructor() {
    // The phone menu covers the screen, so the page behind it must not scroll.
    const root = inject(DOCUMENT).documentElement;
    effect(() => root.classList.toggle('menu-open', this.open()));
  }

  /** Closes the dropdown when keyboard focus moves out of it. */
  protected closeIfLeaving(event: FocusEvent): void {
    const group = event.currentTarget as HTMLElement;
    if (!group.contains(event.relatedTarget as Node | null)) {
      this.dropdown.set(false);
    }
  }

  /** Closes everything after a link is followed. */
  protected closeAll(): void {
    this.open.set(false);
    this.dropdown.set(false);
  }
}
