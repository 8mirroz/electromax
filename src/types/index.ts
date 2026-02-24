export interface PricingPackage {
  title: string;
  monthlyPrice?: number;
  oneTimePrice?: number;
  features: string[];
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface ServiceConfig {
  id: string;
  title: string;
  description: string;
  basePricePerSqm: number;
  packages: PricingPackage[];
  includedSteps: ProcessStep[];
}
