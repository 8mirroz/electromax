import { ServiceConfig } from "../types";

export const SERVICES_DB: Record<string, ServiceConfig> = {
  aps: {
    id: "aps",
    title: "Fire Alarm Systems (APS)",
    description:
      "Reliable automated fire detection and warning systems for commercial real estate.",
    basePricePerSqm: 450, // Rubles per sqm for calculation baseline
    packages: [
      {
        title: "Basic License",
        oneTimePrice: 150000,
        features: ["Initial Project Design", "Standard Sensors", "1 Year Maintenance"],
      },
      {
        title: "Premium Enterprise",
        oneTimePrice: 350000,
        features: [
          "Full BIM Design",
          "Laser Optic Sensors",
          "Integration with Skud",
          "24/7 Monitoring",
        ],
      },
    ],
    includedSteps: [
      { title: "Inspection", description: "Engineer visits the site." },
      { title: "Project Drafting", description: "Designing the schematic layouy." },
      { title: "Installation", description: "Executing cable routing and mounting." },
    ],
  },
  sot: {
    id: "sot",
    title: "Video Surveillance (SOT)",
    description: "High definition IP-camera systems with cloud recording and analytics.",
    basePricePerSqm: 600,
    packages: [
      {
        title: "Retail Starter",
        oneTimePrice: 80000,
        features: ["4 HD Cameras", "Local DVR 1TB", "Mobile App Access"],
      },
    ],
    includedSteps: [
      { title: "Coverage Mapping", description: "Finding blind spots" },
      { title: "Camera Mounting", description: "Setting up IP cameras" },
    ],
  },
};
