import { FEATURE_FLAGS } from "./flags";
import { getServicePageModel, getAllServicePageModels } from "../services-content";
import { ServicePageModel } from "@/types";
import {
  getServicePageModelFromCms,
  getAllServicePageModelsFromCms,
} from "@/lib/cms/service-pages";

export interface CMSAdapter {
  getService(slug: string): Promise<ServicePageModel | null>;
  getAllServices(): Promise<ServicePageModel[]>;
}

class MockCMSAdapter implements CMSAdapter {
  async getService(slug: string): Promise<ServicePageModel | null> {
    return getServicePageModel(slug) || null;
  }

  async getAllServices(): Promise<ServicePageModel[]> {
    return getAllServicePageModels();
  }
}

class PayloadCMSAdapter implements CMSAdapter {
  async getService(slug: string): Promise<ServicePageModel | null> {
    return getServicePageModelFromCms(slug, { locale: "ru" });
  }

  async getAllServices(): Promise<ServicePageModel[]> {
    return getAllServicePageModelsFromCms({ locale: "ru" });
  }
}

// Factory to get correct adapter based on feature flags
export function getCMSAdapter(): CMSAdapter {
  if (FEATURE_FLAGS.CMS_MIGRATION_ACTIVE) {
    return new PayloadCMSAdapter();
  }
  return new MockCMSAdapter();
}

// Singleton instance
export const cms = getCMSAdapter();
