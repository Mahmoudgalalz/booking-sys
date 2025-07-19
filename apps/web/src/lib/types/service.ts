export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  duration: number;
  provider?: {
    id: number;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface ServiceCreateData {
  title: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  duration: number;
}
