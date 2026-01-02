// FILE: store/tenant.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TenantChoice = {
  tenantId: string; // Mongo ObjectId string
  tenantSlug?: string;
  tenantName?: string;
};

type TenantStoreState = {
  selected: TenantChoice | null;
  setSelected: (choice: TenantChoice) => void;
  clearSelected: () => void;
};

export const useTenantStore = create<TenantStoreState>()(
  persist(
    (set) => ({
      selected: null,
      setSelected: (choice) => set({ selected: choice }),
      clearSelected: () => set({ selected: null }),
    }),
    {
      name: "saasify_tenant_store_v1",
      partialize: (state) => ({ selected: state.selected }),
    }
  )
);
