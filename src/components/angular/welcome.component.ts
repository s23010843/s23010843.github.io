import { Component } from '@angular/core';
import { Test } from './app/test/test';
@Component({
  selector: 'app-welcome',
  imports: [Test],
  template: `
    <p>{{title}}</p>
    <app-test></app-test>
    `,
  styles: `
    p {color: red;}
  `
})

export default class AngularWelcome {
  title = 'Angular is working!';
}