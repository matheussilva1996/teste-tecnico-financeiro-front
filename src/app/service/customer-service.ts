import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:3000/customers';

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCustomerById(customerId: string): Observable<any> {
    const url = `${this.apiUrl}/${customerId}`;
    return this.http.get<any>(url);
  }

  addCustomer(customer: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, customer);
  }

  updateCustomer(customer: any): Observable<any> {
    const url = `${this.apiUrl}/${customer.id}`;
    return this.http.put<any>(url, customer);
  }

  deleteCustomer(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }
}
