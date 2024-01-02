import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCurrencyFormat]'
})
export class CurrencyFormatDirective {

  constructor(private el: ElementRef, private ngControl: NgControl) { }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const onlyDigits = event.target.value
      .split("")
      .filter((s: string) => /\d/.test(s))
      .join("")
      .padStart(3, "0");
    const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2);
    // Atualiza o valor no ngModel com o valor numérico
    //this.ngControl.control?.setValue(parseFloat(digitsFloat), { emitEvent: false });
    event.target.value = this.maskCurrency(parseFloat(digitsFloat));
  }

  @HostListener('focus', ['$event'])
  onFocus(event: any): void {
    // Limpa o valor quando o campo é focado
    this.ngControl.control?.setValue(null, { emitEvent: false });
    event.target.value = '';
  }

  private maskCurrency(valor: number, locale: string = 'pt-BR', currency: string = 'BRL'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(valor);
  }
}
