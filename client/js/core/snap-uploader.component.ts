import { Component, ElementRef, EventEmitter, Input, HostBinding, Output, NgZone } from '@angular/core';

import { OCRService } from './ocr.service';
import { NotificationService } from './notification.service';

export const SCAN_INGREDIENTS = 'ocr/SCAN_INGREDIENTS';
export const SCAN_INSTRUCTIONS = 'ocr/SCAN_INSTRUCTIONS';

@Component({
    selector: 'snap-uploader',
    template: `
        <button type="button" (click)="focusInput()">
            <i class="zmdi icon zmdi-camera" *ngIf="!selectedPicture"></i>
            
            <div class="thumbnail" *ngIf="selectedPicture" [ngStyle]="{'background-image': 'url(' + thumbnail + ')'}"></div>
            
            <p class="description" *ngIf="type === '${SCAN_INGREDIENTS}'"><strong>Ajouter des ingrédients</strong><br><small>en prenant une photo</small></p>
            <p class="description" *ngIf="type === '${SCAN_INSTRUCTIONS}'"><strong>Ajouter des étapes</strong><br><small>en prenant une photo</small></p>
            
            <p class="loading-message">Analyse de la photo</p>
        </button>
        
        <input type="file" (change)="fileChangeEvent($event)" accept="image/*" capture="camera">
    `
})

export class SnapUploaderComponent {
    @Input() type: string;
    @Output() getResult = new EventEmitter<Array<string>>();
    @HostBinding('class.processing') isProcessing: boolean = false;

    public selectedPicture: File;
    public thumbnail: string = null;

    constructor(private elementRef: ElementRef,
                private notificationService: NotificationService,
                private ocrService: OCRService,
                private zone: NgZone) {}

    focusInput() {
        this.elementRef.nativeElement.children[1].click();
    }

    fileChangeEvent(fileInput: any) {
        this.isProcessing = true;
        this.selectedPicture = <File> fileInput.target.files[0];

        const reader = new FileReader();
        reader.onload = this.onLoadPicture;
        reader.readAsDataURL(this.selectedPicture);

        if (this.type === SCAN_INGREDIENTS) {
            this.ocrService.scanIngredients(this.selectedPicture)
                .then((result) => {
                    this.resetField(fileInput);

                    this.getResult.emit(result);
                })
                .catch((reason: any) => {
                    this.resetField(fileInput);

                    this.notificationService.notify(reason, 'warning');
                    console.error(reason);
                });
        } else {
            this.ocrService.scanInstructions(this.selectedPicture)
                .then((result) => {
                    this.resetField(fileInput);

                    this.getResult.emit(result);
                })
                .catch((reason: any) => {
                    this.resetField(fileInput);

                    this.notificationService.notify(reason, 'warning');
                    console.error(reason);
                });
        }
    }

    onLoadPicture = (event: Event) => {
        this.zone.run(() => {
            this.thumbnail = (<any> event.target).result;
        });
    }

    resetField(fileInput: any) {
        this.isProcessing = false;
        this.selectedPicture = null;
        this.thumbnail = null;

        fileInput.value = null;
    }
}