import { Injectable } from '@angular/core';

@Injectable()
export class OCRService {

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
                            reject('Aucun texte trouvé dans l\'image !');
                        } else {
                            reject('Erreur lors de l\'analyse de l\'image !');
                        }
                    }
                }
            };

            xhr.open('POST', url, true);
            xhr.send(formData);
        });
    }
}
