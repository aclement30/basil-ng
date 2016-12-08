import { Component } from '@angular/core';

@Component({
    selector: 'footer',
    template: `
        Copyright &copy; 2016 - Alexandre Clément

        <ul class="f-menu">
            <li><a href="">Home</a></li>
            <li><a href="">Dashboard</a></li>
            <li><a href="">Reports</a></li>
            <li><a href="">Support</a></li>
            <li><a href="">Contact</a></li>
        </ul>
    `
})

export class FooterComponent { }