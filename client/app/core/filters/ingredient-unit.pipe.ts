import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({name: 'ingredientUnit'})
export class IngredientUnitPipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(value: string): string {
    switch (value) {
      case 'cup':
      case 'box':
      case 'tablet':
      case 'bit':
      case 'packet':
      case 'tsp':
      case 'tbsp':
      case 'pinch':
        return this.translate.instant(`units.${value}`);
      default:
        return value;
    }
  }
}
