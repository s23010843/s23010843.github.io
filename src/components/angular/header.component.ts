import { Component, type OnInit } from '@angular/core';
import { Navbar } from './app/navbar/navbar';

@Component({
  selector: 'app-header',
  imports: [Navbar],
  template: `
    <h1 id="chat">{{ chatText }}</h1>
    <app-navbar></app-navbar>
    `,
  styles: `
    p {color: red;}
  `
})

export default class Header implements OnInit {
  // Keep a visible fallback so the greeting does not disappear during hydration or fetch errors.
  chatText = 'Welcome to our Homepage';

  async ngOnInit() {
    try {
      const response = await fetch('/data.xml');
      if (!response.ok) throw new Error('Failed to load data.xml');

      const xml = await response.text();
      const xmlDoc = new DOMParser().parseFromString(xml, 'application/xml');
      const chat = xmlDoc.getElementsByTagName('chat')[0]?.textContent?.trim();
      if (chat) this.chatText = chat;
    } catch {
      // Keep the header stable even if the XML endpoint fails.
      this.chatText = this.chatText;
    }
  }
}