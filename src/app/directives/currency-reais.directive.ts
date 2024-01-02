import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCurrencyFormatter]'
})
export class CurrencyFormatterDirective {

  constructor(private el: ElementRef, private control: NgControl) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    let numberValue = parseFloat(value.replace(/[^\d\.]/g, ''));
    if (!isNaN(numberValue)) {
      this.control.valueAccessor?.writeValue(numberValue);
    }
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value: string) {
    let numberValue = parseFloat(value.replace(/[^\d\.]/g, ''));
    if (!isNaN(numberValue)) {
      this.el.nativeElement.value = numberValue;
    }
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: string) {
    let numberValue = parseFloat(value.replace(/[^\d\.]/g, ''));
    if (!isNaN(numberValue)) {
      this.el.nativeElement.value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numberValue);
    }
  }
}
