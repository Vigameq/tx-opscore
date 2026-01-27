import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SalesOrderEntry, SalesOrderStoreService } from '../services/sales-order-store.service';

@Component({
  selector: 'app-sales-order-po',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sales-order-po.component.html',
  styleUrl: './sales-order-po.component.scss'
})
export class SalesOrderPoComponent {
  private salesOrderStore: SalesOrderStoreService;

  constructor(salesOrderStore: SalesOrderStoreService) {
    this.salesOrderStore = salesOrderStore;
  }

  filters = {
    customer: '',
    status: '',
    project: '',
    dateFrom: '',
    dateTo: ''
  };

  get salesOrders(): SalesOrderEntry[] {
    return this.salesOrderStore.getSalesOrders();
  }

  get filteredOrders(): SalesOrderEntry[] {
    const customer = this.filters.customer.toLowerCase();
    const status = this.filters.status.toLowerCase();
    const project = this.filters.project.toLowerCase();
    const dateFrom = this.filters.dateFrom ? new Date(this.filters.dateFrom) : null;
    const dateTo = this.filters.dateTo ? new Date(this.filters.dateTo) : null;

    return this.salesOrders.filter((order) => {
      const matchesCustomer = customer ? order.customer.toLowerCase() === customer : true;
      const matchesStatus = status ? order.status.toLowerCase() === status : true;
      const matchesProject = project
        ? order.project.toLowerCase().includes(project)
        : true;
      const deliveryDate = new Date(order.delivery);
      const matchesDateFrom = dateFrom ? deliveryDate >= dateFrom : true;
      const matchesDateTo = dateTo ? deliveryDate <= dateTo : true;

      return (
        matchesCustomer &&
        matchesStatus &&
        matchesProject &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }

  isOpenDisabled(status: string): boolean {
    return status === 'QUOTATION_ACCEPTED' || status === 'PO_RECEIVED';
  }
}
