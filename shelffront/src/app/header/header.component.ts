import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  currentTheme: string = 'light';

  constructor() {
    let savedTheme = localStorage.getItem('skibidi-theme');
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.applyThemeToPage(this.currentTheme);
    }
  }

  setTheme(theme: string): void {
    this.currentTheme = theme;
    this.applyThemeToPage(theme);
    localStorage.setItem('skibidi-theme', theme);
  }

  private applyThemeToPage(theme: string): void {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }

  switchToLight(): void {
    this.setTheme('light');
  }

  switchToDark(): void {
    this.setTheme('dark');
  }
}
