
export enum Page {
  Home = 'home',
  Shop = 'shop',
  Product = 'product',
  Assistant = 'assistant',
  Landscape = 'landscape',
  AMC = 'amc',
  Lab = 'lab',
  Knowledge = 'knowledge',
  About = 'about',
  Visit = 'visit',
  Account = 'account',
  Cart = 'cart',
  AddProduct = 'add-product'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  maintenance: 'Low' | 'Medium' | 'High';
  light: 'Direct' | 'Indirect' | 'Shade';
  description: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

export interface CartItem {
  product: StoreProduct;
  quantity: number;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  content: string;
  publishDate?: string;
}

export interface AssistantData {
  userType: string;
  location: string;
  environment: string;
  budget: string;
  features: string[];
}
