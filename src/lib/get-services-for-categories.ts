import type { CategoryId } from "@/data/categories";
import { services, type Service } from "@/data/services";

/**
 * The same categoryIds-matching logic Content Architecture defines for
 * "Services Delivered" — a client's tagged content shares categoryIds with
 * the services that apply to it. Extracted here so Featured Work (and
 * later, Client Hub) don't each reimplement it.
 */
export function getServicesForCategories(categoryIds: CategoryId[]): Service[] {
  return services.filter((service) =>
    service.categoryIds.some((id) => categoryIds.includes(id))
  );
}
