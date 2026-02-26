export interface ConfigOption {
  id: string;
  label: string;
  type: "button" | "input";
  priceMultiplier?: number;
  priceAddition?: number;
  placeholder?: string;
  options?: string[];
}
