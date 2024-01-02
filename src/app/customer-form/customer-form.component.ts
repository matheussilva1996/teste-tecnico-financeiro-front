// customer-form.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../service/customer-service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  animations: [
    trigger('buttonState', [
      state('normal', style({
        backgroundColor: 'green',
        transform: 'scale(1)'
      })),
      state('loading', style({
        backgroundColor: 'gray',
        transform: 'scale(0.9)'
      })),
      transition('normal => loading', animate('200ms ease-in')),
      transition('loading => normal', animate('200ms ease-out'))
    ])
  ]
})
export class CustomerFormComponent implements OnInit {
  customer: any = {}; // Objeto para armazenar os dados do cliente
  customerForm!: FormGroup;

  buttonState = 'normal'; // Estado inicial da animação

  constructor(private customerService: CustomerService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern('[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}')]],
      birthdate: ['', [Validators.required, this.ageValidator]],
      income: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      registrationDate: [this.getCurrentDate()],
    });
  }

  ageValidator(control: any): { [key: string]: boolean } | null {
    const birthdateString = control.value;

    if (!birthdateString) {
      // Se a data de nascimento não estiver preenchida, não há erro
      return null;
    }

    const [day, month, year] = birthdateString.split('/').map(Number);

    // Certifique-se de que a data de nascimento é válida
    const isValidDate = !isNaN(day) && !isNaN(month) && !isNaN(year);

    if (!isValidDate) {
      return { 'invalidDate': true };
    }

    // Crie uma data usando o formato brasileiro "dd/MM/yyyy"
    const birthdate = new Date(`${month}/${day}/${year}`);

    // Calcule a idade do cliente
    const age = new Date().getFullYear() - birthdate.getFullYear();

    // Verifique se a idade está na faixa permitida (entre 18 e 60 anos)
    if (age < 18 || age > 60) {
      return { 'invalidAge': true };
    }

    // Se estiver na faixa permitida e a data for válida, retorne nulo (sem erro)
    return null;
  }



  submitForm(): void {
    this.buttonState = 'loading';
    this.customer = this.customerForm.value;

     this.customer.registrationDate = this.convertToMockDateFormat(this.customerForm.get('registrationDate')?.value.toString());
     this.customer.income = this.convertToMockIncome(this.customer.income)
     this.customer.birthdate = this.convertToMockDateTime(this.customerForm.get('birthdate')?.value);

    // Se o cliente não tiver um ID, é uma adição
    this.customerService.addCustomer(this.customer).subscribe(async () => {
      // Lógica após a adição
      this.buttonState = 'normal';
      console.log('Cliente adicionado com sucesso!');

    });


    // Limpar o formulário após a submissão
    this.customer = {};

    this.router.navigate(['/customer-list']);

  }

  convertToMockIncome(value:any)
  {
    return (Number(value.replace(/[^\d,]/g, '').replace(',', '.')) * 10).toFixed(2)
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const formattedDate = this.formatDate(currentDate.toString()) // Obtém a data no formato 'yyyy-MM-dd'
    return formattedDate;
  }

  isCPF(): boolean{
    return this.customer.cpf == null ? true : this.customer.cpf.length < 12 ? true : false;
 }

 getCpfCnpjMask(): string{
    return this.isCPF() ? '000.000.000-009' : '00.000.000/0000-00';
 }

 formatDate(date: string | null): string {
    if (!date) {
      return ''; // Retorna uma string vazia se a data for nula
    }

    const parsedDate = new Date(date);
    const day = parsedDate.getDate();
    const month = parsedDate.getMonth() + 1; // Mês é baseado em zero, então adicionamos 1
    const year = parsedDate.getFullYear();

    // Formata a data como dd/mm/yyyy
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  }

  private convertToMockDateFormat(date: string | null): string {
    if (!date) {
      return ''; // Retorna uma string vazia se a data for nula
    }

    const [day, month, year] = date.split('/'); // Supondo que a data está no formato dd/mm/yyyy

    // Certifique-se de adicionar zeros à esquerda, se necessário
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    return formattedDate;
  }


  convertToMockDateTime(date: string): string {
    const [day, month, year] = date.split('/');
    return `${month.padStart(2, '0')}-${day.padStart(2, '0')}-${year}`;
  }


}
