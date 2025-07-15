class OrderService {
  constructor() {
    this.orders = [
      {
        Id: 1,
        orderNumber: 'ORD-001',
        customerName: 'Ahmed Khan',
        customerEmail: 'ahmed.khan@example.com',
        customerPhone: '+92-300-1234567',
        status: 'Pending',
        paymentMethod: 'COD',
        orderDate: '2024-01-15T10:30:00Z',
        totalAmount: 15600,
        items: [
          {
            productId: 1,
            productName: 'Wireless Headphones',
            quantity: 2,
            price: 7800
          }
        ],
        shippingAddress: {
          street: '123 Main Street',
          city: 'Karachi',
          postalCode: '75500',
          country: 'Pakistan'
        }
      },
      {
        Id: 2,
        orderNumber: 'ORD-002',
        customerName: 'Sara Ali',
        customerEmail: 'sara.ali@example.com',
        customerPhone: '+92-301-9876543',
        status: 'Shipped',
        paymentMethod: 'Bank',
        orderDate: '2024-01-14T14:20:00Z',
        totalAmount: 8900,
        items: [
          {
            productId: 2,
            productName: 'Smartphone Case',
            quantity: 1,
            price: 8900
          }
        ],
        shippingAddress: {
          street: '456 Oak Avenue',
          city: 'Lahore',
          postalCode: '54000',
          country: 'Pakistan'
        }
      },
      {
        Id: 3,
        orderNumber: 'ORD-003',
        customerName: 'Hassan Shah',
        customerEmail: 'hassan.shah@example.com',
        customerPhone: '+92-302-5555666',
        status: 'Delivered',
        paymentMethod: 'JazzCash',
        orderDate: '2024-01-13T09:15:00Z',
        totalAmount: 4500,
        items: [
          {
            productId: 3,
            productName: 'USB Cable',
            quantity: 3,
            price: 1500
          }
        ],
        shippingAddress: {
          street: '789 Pine Road',
          city: 'Islamabad',
          postalCode: '44000',
          country: 'Pakistan'
        }
      },
      {
        Id: 4,
        orderNumber: 'ORD-004',
        customerName: 'Fatima Malik',
        customerEmail: 'fatima.malik@example.com',
        customerPhone: '+92-303-7777888',
        status: 'Packed',
        paymentMethod: 'COD',
        orderDate: '2024-01-12T16:45:00Z',
        totalAmount: 12300,
        items: [
          {
            productId: 4,
            productName: 'Bluetooth Speaker',
            quantity: 1,
            price: 12300
          }
        ],
        shippingAddress: {
          street: '321 Cedar Street',
          city: 'Faisalabad',
          postalCode: '38000',
          country: 'Pakistan'
        }
      },
      {
        Id: 5,
        orderNumber: 'ORD-005',
        customerName: 'Omar Siddiqui',
        customerEmail: 'omar.siddiqui@example.com',
        customerPhone: '+92-304-9999000',
        status: 'Pending',
        paymentMethod: 'Bank',
        orderDate: '2024-01-11T11:30:00Z',
        totalAmount: 6700,
        items: [
          {
            productId: 5,
            productName: 'Phone Charger',
            quantity: 2,
            price: 3350
          }
        ],
        shippingAddress: {
          street: '654 Elm Drive',
          city: 'Multan',
          postalCode: '60000',
          country: 'Pakistan'
        }
      }
    ];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.orders]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const order = this.orders.find(o => o.Id === parseInt(id));
        if (order) {
          resolve({ ...order });
        } else {
          reject(new Error("Order not found"));
        }
      }, 200);
    });
  }

  async getByStatus(status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.orders.filter(o => o.status === status);
        resolve([...filtered]);
      }, 250);
    });
  }

  async getByCustomer(customerEmail) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.orders.filter(o => o.customerEmail === customerEmail);
        resolve([...filtered]);
      }, 250);
    });
  }

  async create(order) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Math.max(...this.orders.map(o => o.Id)) + 1;
        const orderNumber = `ORD-${newId.toString().padStart(3, '0')}`;
        
        const newOrder = {
          ...order,
          Id: newId,
          orderNumber,
          orderDate: new Date().toISOString(),
          status: 'Pending'
        };
        
        this.orders.push(newOrder);
        resolve({ ...newOrder });
      }, 300);
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.orders.findIndex(o => o.Id === parseInt(id));
        if (index !== -1) {
          this.orders[index] = { 
            ...this.orders[index], 
            ...data,
            updatedAt: new Date().toISOString()
          };
          resolve({ ...this.orders[index] });
        } else {
          reject(new Error("Order not found"));
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.orders.findIndex(o => o.Id === parseInt(id));
        if (index !== -1) {
          const deleted = this.orders.splice(index, 1)[0];
          resolve({ ...deleted });
        } else {
          reject(new Error("Order not found"));
        }
      }, 300);
    });
  }

  async updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.orders.findIndex(o => o.Id === parseInt(id));
        if (index !== -1) {
          this.orders[index].status = status;
          this.orders[index].updatedAt = new Date().toISOString();
          resolve({ ...this.orders[index] });
        } else {
          reject(new Error("Order not found"));
        }
      }, 200);
    });
  }

  async getOrdersByDateRange(startDate, endDate) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.orders.filter(o => {
          const orderDate = new Date(o.orderDate);
          return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
        });
        resolve([...filtered]);
      }, 300);
    });
  }

  async getOrderStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          totalOrders: this.orders.length,
          pendingOrders: this.orders.filter(o => o.status === 'Pending').length,
          shippedOrders: this.orders.filter(o => o.status === 'Shipped').length,
          deliveredOrders: this.orders.filter(o => o.status === 'Delivered').length,
          totalRevenue: this.orders.reduce((sum, o) => sum + o.totalAmount, 0)
        };
        resolve(stats);
      }, 250);
    });
  }
}

export default new OrderService();