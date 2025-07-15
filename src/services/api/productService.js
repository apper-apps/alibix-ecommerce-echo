import mockProducts from "@/services/mockData/products.json";

class ProductService {
  constructor() {
    this.products = [...mockProducts];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.products]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = this.products.find(p => p.Id === parseInt(id));
        if (product) {
          resolve({ ...product });
        } else {
          reject(new Error("Product not found"));
        }
      }, 200);
    });
  }

  async getByCategory(category) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.products.filter(p => 
          p.category.toLowerCase() === category.toLowerCase()
        );
        resolve([...filtered]);
      }, 300);
    });
  }

  async search(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const searchTerm = query.toLowerCase();
        const filtered = this.products.filter(p => 
          p.title.toLowerCase().includes(searchTerm) ||
          p.titleUrdu.includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm)
        );
        resolve([...filtered]);
      }, 300);
    });
  }

async getFeatured() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const featured = this.products
          .filter(p => p.discountedPrice && p.stock > 0)
          .slice(0, 8);
        resolve([...featured]);
      }, 300);
    });
  }

  async searchByImage(imageFile) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const shuffled = [...this.products].sort(() => 0.5 - Math.random());
        const mockResults = shuffled.slice(0, Math.floor(Math.random() * 8) + 4);
        resolve(mockResults);
      }, 2000);
    });
  }

  async getTrending() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trending = [...this.products]
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);
        resolve(trending);
      }, 250);
    });
  }

  async getRelated(productId, category) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const related = this.products
          .filter(p => p.Id !== parseInt(productId) && p.category === category)
          .slice(0, 4);
        resolve([...related]);
      }, 200);
    });
  }

create(product) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Math.max(...this.products.map(p => p.Id)) + 1;
        const newProduct = { 
          ...product, 
          Id: newId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.products.push(newProduct);
        resolve({ ...newProduct });
      }, 300);
    });
  }

  update(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.products.findIndex(p => p.Id === parseInt(id));
        if (index !== -1) {
          this.products[index] = { 
            ...this.products[index], 
            ...data,
            updatedAt: new Date().toISOString()
          };
          resolve({ ...this.products[index] });
        } else {
          reject(new Error("Product not found"));
        }
      }, 300);
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.products.findIndex(p => p.Id === parseInt(id));
        if (index !== -1) {
          const deleted = this.products.splice(index, 1)[0];
          resolve({ ...deleted });
        } else {
          reject(new Error("Product not found"));
        }
      }, 300);
    });
  }

  async updateStock(id, quantity) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.products.findIndex(p => p.Id === parseInt(id));
        if (index !== -1) {
          this.products[index].stock = Math.max(0, quantity);
          resolve({ ...this.products[index] });
        } else {
          reject(new Error("Product not found"));
        }
      }, 200);
    });
  }

  async getSoldOutProducts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const soldOut = this.products.filter(p => p.stock === 0);
        resolve([...soldOut]);
      }, 250);
    });
  }
}

export default new ProductService();