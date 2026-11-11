import type { LeadSubmission } from "@/server/leads/contract";

export interface LeadDeliveryRepository {
  deliver(lead: LeadSubmission): Promise<void>;
}

export class LeadDeliveryUnavailableError extends Error {
  constructor() {
    super("Chưa cấu hình kênh tiếp nhận yêu cầu.");
    this.name = "LeadDeliveryUnavailableError";
  }
}

class UnconfiguredLeadDelivery implements LeadDeliveryRepository {
  async deliver(): Promise<void> {
    throw new LeadDeliveryUnavailableError();
  }
}

export function getLeadDeliveryRepository(): LeadDeliveryRepository {
  const provider = process.env.LEAD_PROVIDER?.trim().toLowerCase() || "none";

  if (provider === "none") return new UnconfiguredLeadDelivery();

  throw new Error(
    `Lead provider "${provider}" is not implemented. Add an approved delivery adapter before enabling it.`,
  );
}
