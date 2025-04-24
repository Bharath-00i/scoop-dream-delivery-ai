
export interface FlavorItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: number;
  category: "regular" | "premium" | "seasonal";
}
