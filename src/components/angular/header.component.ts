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
  chatText = '';

  async ngOnInit() {
    try {
      const response = await fetch('/data.xml');
      if (!response.ok) throw new Error('Failed to load data.xml');

      const xml = await response.text();
      const xmlDoc = new DOMParser().parseFromString(xml, 'application/xml');
      this.chatText = xmlDoc.getElementsByTagName('chat')[0]?.textContent?.trim() ?? '';
    } catch {
      // Keep the header stable even if the XML endpoint fails.
      this.chatText = '';
    }
  }
}