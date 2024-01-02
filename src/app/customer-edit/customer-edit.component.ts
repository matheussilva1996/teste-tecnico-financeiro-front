import { CurrencyFormatDirective } from './../directives/currency-format.directive';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyFormatPipe } from '../pipes/currency-format.pipe';
import { CustomerService } from '../service/customer-service';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss']
})
export class CustomerEditComponent implements OnInit {
  customer: any = {};
  buttonState = 'normal'; // Estado inicial da animação
  customerForm!: FormGroup;
  backupIncome: any;

  constructor(private route: ActivatedRoute, private customerService: CustomerService, private router: Router, private fb: FormBuilder, private currencyFormat: CurrencyFormatPipe) {}

  ngOnInit(): void {
    const customerId = this.route.snapshot.params['id'];
    this.loadCustomer(customerId);

    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern('[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}')]],
      birthdate: ['', [Validators.required, this.ageValidator]],
      income: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      registrationDate: [this.getCurrentDate()],
    });
  }


  getCurrentDate(): string {
    const currentDate = new Date();
    const formattedDate = this.formatDate(currentDate.toString()) // Obtém a data no formato 'yyyy-MM-dd'
    return formattedDate;
  }


  formatDate(date: string | null): string {
    if (!date) {
      return ''; // Retorna uma string vazia se a data for nula
    }

    const parsedDate = new Date(date);
    const day = parsedDate.getDate();
    const month = parsedDate.getMonth() + 1; // Mês é baseado em zero, então adicionamos 1
    const year = parsedDate.getFullYear();

    // Verifica se a data é válida antes de formatar
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return ''; // Retorna uma string vazia para datas inválidas
    }

    // Formata a data como dd/mm/yyyy
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
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

  loadCustomer(customerId: string): void {
    this.customerService.getCustomerById(customerId).subscribe(
      (data) => {

        this.customer = data;
        this.customer.birthdate = this.formatDate(this.customer.birthdate)
        console.log("ao inicializar valor cru",this.customer.income)
        this.customer.income = this.currencyFormat.transform(this.customer.income)
        this.backupIncome = this.customer.income
        console.log("ao inicializar valor formatado",this.customer.income)
      },
      (error) => {
        console.error(error);
        // Trate o erro conforme necessário, como redirecionar para a lista de clientes
        this.router.navigate(['/customer-list']);
      }
    );
  }

  submitForm(): void {
    this.buttonState = 'loading';

    console.log("valor no submit",this.customer.income)


    if(this.customer.income ) this.customer.income = this.convertToMockIncome(this.customer.income);

    console.log("valor income depois alterado", this.customer.income)

    if (this.customer.birthdate) {
      // Formate a data no formato ISO antes de salvar
      const [day, month, year] = this.customer.birthdate.split('/');
      this.customer.birthdate = `${month}/${day}/${year}`;
    }

    if (this.customer.id) {
      // Se o cliente já tiver um ID, é uma edição
      this.customerService.updateCustomer(this.customer).subscribe(() => {
        // Lógica após a atualização
        this.buttonState = 'normal';
        console.log('Cliente atualizado com sucesso!');
      });
    }
    this.router.navigate(['/customer-list']);
  }

  convertToMockDateTime(date: string): string {
    const [day, month, year] = date.split('/');
    return `${month.padStart(2, '0')}-${day.padStart(2, '0')}-${year}`;
  }



  convertToMockIncome(value:any)
  {
    if (value !== this.backupIncome) {
      return (Number(value.replace(/[^\d,]/g, '').replace(',', '.')) * 10).toFixed(2);
    }
    return (Number(value.replace(/[^\d,]/g, '').replace(',', '.')) ).toFixed(2);;
  }


}
