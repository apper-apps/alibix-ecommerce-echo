import categoriesData from "@/services/mockData/categories.json";

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.categories]);
      }, 250);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const category = this.categories.find(c => c.Id === parseInt(id));
        if (category) {
          resolve({ ...category });
        } else {
          reject(new Error("Category not found"));
        }
      }, 200);
    });
  }

  async getBySlug(slug) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const category = this.categories.find(c => c.slug === slug);
        if (category) {
          resolve({ ...category });
        } else {
          reject(new Error("Category not found"));
        }
      }, 200);
    });
  }

  create(category) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Math.max(...this.categories.map(c => c.Id)) + 1;
        const newCategory = { ...category, Id: newId };
        this.categories.push(newCategory);
        resolve({ ...newCategory });
      }, 300);
    });
  }

  update(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.categories.findIndex(c => c.Id === parseInt(id));
        if (index !== -1) {
          this.categories[index] = { ...this.categories[index], ...data };
          resolve({ ...this.categories[index] });
        } else {
          reject(new Error("Category not found"));
        }
      }, 300);
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.categories.findIndex(c => c.Id === parseInt(id));
        if (index !== -1) {
          const deleted = this.categories.splice(index, 1)[0];
          resolve({ ...deleted });
        } else {
          reject(new Error("Category not found"));
        }
      }, 300);
    });
  }
}

export default new CategoryService();