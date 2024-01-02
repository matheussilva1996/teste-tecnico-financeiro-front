import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCpfFormat]'
})
export class CpfFormatDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    }

    this.el.nativeElement.value = value;
  }
}
