// File: app/tenant/page.tsx
import { redirect } from "next/navigation";

export default function TenantEntry() {
  redirect("/t/select-tenant"); // or wherever your tenant selector is
}
