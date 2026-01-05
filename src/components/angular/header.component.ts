import { Component } from '@angular/core';
import { Navbar } from './app/navbar/navbar';

@Component({
  selector: 'app-header',
  imports: [Navbar],
  template: `
    <h1 id="chat"></h1>
    <app-navbar></app-navbar>
    `,
  styles: `
    p {color: red;}
  `
})

export default class Header {

}