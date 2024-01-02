import { Router, RouterModule } from '@angular/router';
// customer-list.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerService } from '../service/customer-service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  displayedColumns: string[] = ['select','name', 'cpf', 'birthDate',  'income', 'registrationDate', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  pages!: number[];
  selection = new SelectionModel<any>(true, []); // Adicione a instância do SelectionModel

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Adição do inicializador padrão
  @ViewChild(MatSort, { static: true }) sort!: MatSort; // Adição do inicializador padrão


  constructor(private customerService: CustomerService, private router: Router) { }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {
    this.customerService.getCustomers().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: any): void {
    this.dataSource.filter = filterValue?.value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  editCustomer(customer: any): void {
    this.router.navigate(['/customer-edit', customer.id]);
  }

  deleteCustomer(customerId: number): void {
    this.customerService.deleteCustomer(customerId).subscribe(() => {
      this.getCustomers();
    });
  }

  // Adicione as seguintes funções para lidar com a seleção e remoção de itens
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  removeSelectedRows() {
    this.selection.selected.forEach(selected => {
      const index: number = this.dataSource.data.findIndex(d => d === selected);
      if (index !== -1) {
        this.dataSource.data.splice(index, 1);
        this.dataSource = new MatTableDataSource<any>(this.dataSource.data);
      }
    });
    this.selection = new SelectionModel<any>(true, []);
  }

}
