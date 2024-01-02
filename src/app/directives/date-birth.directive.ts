// date-of-birth.directive.ts
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDateOfBirthFormat]'
})
export class DateOfBirthFormatDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (value.length > 8) {
      value = value.substring(0, 8); // Limita a 8 caracteres (ddmmyyyy)
    }

    if (value.length >= 2 && value.length < 4) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    } else if (value.length >= 4) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}/${value.substring(4)}`;
    }

    input.value = value;
  }

}
