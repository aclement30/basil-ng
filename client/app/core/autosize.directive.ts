// Source: https://github.com/stevepapa/angular2-autosize

import { ElementRef, HostListener, Directive} from '@angular/core';

@Directive({
    selector: 'textarea[autosize]'
})

export class Autosize {
    @HostListener('input', ['$event.target']) onInput(textArea: HTMLTextAreaElement): void {
        this.adjust();
    }

    constructor(public element: ElementRef) {}

    ngAfterContentChecked(): void{
        this.adjust();
    }

    adjust(): void{
        this.element.nativeElement.style.overflow = 'hidden';
        this.element.nativeElement.style.height = 'auto';
        this.element.nativeElement.style.height = this.element.nativeElement.scrollHeight + "px";
    }
}
