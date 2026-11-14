export const leadContexts = ["general", "food-processing", "erp", "outsourcing", "body-shop"] as const;
export const leadContextLabels: Record<(typeof leadContexts)[number], string> = {
  general: "Liên hệ chung", "food-processing": "Ngành thực phẩm", erp: "Dịch vụ ERP",
  outsourcing: "Outsourcing", "body-shop": "Body Shop",
};
export const serviceInterests = ["TNM ERP", "Phát triển phần mềm", "Nhân lực công nghệ", "Khác"] as const;
export const foodInterests = ["Nguyên vật liệu và tồn kho", "Tiến độ sản xuất", "Hao hụt và chi phí", "Chất lượng và truy xuất lô", "Chưa xác định"] as const;
export const companySizes = ["1-50", "51-200", "201-500", "500+"] as const;
export const detailOptions = {
  erpNeed: ["Đánh giá mức độ phù hợp", "Kết nối dữ liệu", "Làm rõ phạm vi mở rộng", "Khác"],
  projectType: ["Phần mềm mới", "Mở rộng hệ thống hiện có", "Tích hợp hệ thống", "Khác"],
  estimatedTiming: ["Đang tìm hiểu", "Trong 1–3 tháng", "Sau 3 tháng", "Chưa xác định"],
  role: ["Developer", "QA / Tester", "Business Analyst", "Khác"],
  headcount: ["1", "2–3", "4–5", "Chưa xác định"],
  foodPriority: foodInterests,
} as const;
export type LeadDetailKey = keyof typeof detailOptions;
export const contextDetailKeys: Record<(typeof leadContexts)[number], readonly LeadDetailKey[]> = {
  general: [], "food-processing": ["foodPriority"], erp: ["erpNeed"],
  outsourcing: ["projectType", "estimatedTiming"], "body-shop": ["role", "headcount"],
};
export const detailLabels: Record<LeadDetailKey, string> = {
  erpNeed: "Nhu cầu ERP", projectType: "Loại dự án", estimatedTiming: "Thời điểm dự kiến",
  role: "Vai trò cần trao đổi", headcount: "Số lượng dự kiến", foodPriority: "Ưu tiên cần trao đổi",
};
export function interestsFor(context: string): readonly string[] {
  if (context === "food-processing") return foodInterests;
  if (context === "erp") return [serviceInterests[0]];
  if (context === "outsourcing") return [serviceInterests[1]];
  if (context === "body-shop") return [serviceInterests[2]];
  return serviceInterests;
}
