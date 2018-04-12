import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class OCRService {

    constructor(
        private translate: TranslateService,
    ) {}

    scanIngredients(file: File): Promise<string[]> {
        return this.request('api/ocr/ingredients', file);
    }

    scanInstructions(file: File): Promise<string[]> {
        return this.request('api/ocr/instructions', file);
    }

    private request(url: string, file: File): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const formData: any = new FormData();
            const xhr = new XMLHttpRequest();

            formData.append('uploadedFile', file, file.name);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        if (xhr.status === 204) {
                            reject(this.translate.instant('recipeForm.noTextFound'));
                        } else {
                            reject(this.translate.instant('recipeForm.parseError'));
                        }
                    }
                }
            };

            xhr.open('POST', url, true);
            xhr.send(formData);
        });
    }
}
