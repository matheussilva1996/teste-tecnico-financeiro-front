// nome-validator.directive.ts
import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appNomeValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: NomeValidatorDirective, multi: true }]
})
export class NomeValidatorDirective implements Validator {
  @Input('appNomeValidator') set requiredNames(value: number) {
    this._requiredNames = value || 2;
  }
  private _requiredNames: number = 2;

  validate(control: AbstractControl): ValidationErrors | null {
    const nome = control.value;

    if (!nome) {
      return null; // Deixe outras validações cuidarem de campos vazios
    }

    const nomes = nome.split(' ');
    const isValid = nomes.length >= this._requiredNames;

    return isValid ? null : { invalidNome: true };
  }
}
