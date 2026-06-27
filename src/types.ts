export type Page =
  | 'home'
  | 'services'
  | 'additional-services'
  | 'quote'
  | 'gallery'
  | 'reviews'
  | 'about'
  | 'contact';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  iconName: string;
  examples: string[];
  imagePlaceholder: string;
}

export interface AdditionalService {
  id: string;
  title: string;
  description: string;
  iconName: string;
  examples?: string[];
  imagePlaceholder?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  suburb?: string;
  date?: string;
  comment: string;
  verified: boolean;
  job?: string;
}

export interface GalleryProject {
  id: string;
  title: string;
  category: 'wardrobes' | 'bedrooms' | 'office' | 'storage' | 'outdoor' | 'before-after';
  image: string;
  description: string;
}

export interface QuoteFormData {
  fullName: string;
  phone: string;
  email: string;
  suburb: string;
  preferredDate: string;
  preferredTime: string;
  furnitureBrand: string;
  productLink: string;
  itemsToAssemble: string;
  numberOfItems: number;
  roomPrepRequired: boolean;
  packagingRemovalRequired: boolean;
  skirtingBoardRemovalRequired: boolean;
  floorLevelingRequired: boolean;
  wallFixingRequired: boolean;
  furniturePositioningRequired: boolean;
  additionalNotes: string;
  preferredContact: 'phone' | 'whatsapp' | 'email';
}
