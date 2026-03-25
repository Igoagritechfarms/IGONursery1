
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
  Cart = 'cart'
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

export interface AssistantData {
  userType: string;
  location: string;
  environment: string;
  budget: string;
  features: string[];
}
