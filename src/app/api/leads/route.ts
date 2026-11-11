import { getLeadDeliveryRepository, LeadDeliveryUnavailableError } from "@/server/leads/delivery";
import { validateLeadSubmission } from "@/server/leads/contract";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json(
      { error: { code: "UNSUPPORTED_MEDIA_TYPE", message: "Yêu cầu phải dùng JSON." } },
      { status: 415 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json(
        { error: { code: "INVALID_JSON", message: "Dữ liệu gửi lên không phải JSON hợp lệ." } },
        { status: 400 },
      );
    }

    throw error;
  }

  const validation = validateLeadSubmission(payload);
  if (!validation.success) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_FAILED",
          message: "Vui lòng kiểm tra lại thông tin.",
          fields: validation.fieldErrors,
        },
      },
      { status: 400 },
    );
  }

  const delivery = getLeadDeliveryRepository();
  try {
    await delivery.deliver(validation.data);
  } catch (error) {
    if (error instanceof LeadDeliveryUnavailableError) {
      return Response.json(
        {
          error: {
            code: "LEAD_DELIVERY_UNAVAILABLE",
            message:
              "Kênh tiếp nhận yêu cầu chưa được cấu hình. Vui lòng liên hệ TNT qua kênh đã được xác nhận.",
          },
        },
        { status: 503 },
      );
    }

    throw error;
  }

  return Response.json({ accepted: true }, { status: 202 });
}
