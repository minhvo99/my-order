interface LocaleText {
  name: string;
  description?: string;
}

interface NameSet {
  kr: LocaleText;
  en: LocaleText;
  zh: LocaleText;
  ko: LocaleText;
  ja: LocaleText;
}

interface ImageInfo {
  path: string;
  url: string;
}

interface OptionItem {
  nameSet: {
    kr: { name: string };
    en: { name: string };
  };
  additionalCost_pickup: number;
  additionalCost_dinein: number;
  additionalCost_delivery: number;
  default: boolean;
}

interface MenuOption {
  nameSet: {
    kr: { name: string };
    en: { name: string };
  };
  items: OptionItem[];
}

export interface MenuItem {
  nameSet: NameSet;
  categoryID: string;
  price_pickup: number;
  price_delivery: number;
  price_dinein: number;
  requirePrice: boolean;
  img: ImageInfo;
  imgthumb: ImageInfo;
  options: MenuOption[];
  isActive: boolean;
}