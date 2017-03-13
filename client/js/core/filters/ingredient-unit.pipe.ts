import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'ingredientUnit'})
export class IngredientUnitPipe implements PipeTransform {
    transform(value: string): string {
        switch (value) {
            case 'cup':
                return 'tasse';
            case 'box':
                return 'boîte';
            case 'tablet':
                return 'tablette';
            case 'bit':
                return 'morceau';
            case 'packet':
                return 'sachet';
            case 'tsp':
                return 'c. à c.';
            case 'tbsp':
                return 'c. à s.';
            case 'pinch':
                return 'pincée';
            default:
                return value;
        }
    }
}