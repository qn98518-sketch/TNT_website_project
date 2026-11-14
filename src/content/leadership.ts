import type { LeadershipProfile } from "@/content/models";

// Biographies transcribed from the five profile images supplied in thong_tin.
const profiles: readonly Omit<LeadershipProfile, "title" | "description" | "imageAlt">[] = [
  {
    id: "nguyen-huu-chu",
    name: "Nguyễn Hữu Chữ",
    role: "Sáng lập kiêm Giám đốc điều hành",
    summary: "20+ năm phát triển phần mềm",
    details: [
      "20+ năm kinh nghiệm phát triển và xây dựng phần mềm.",
      "15+ năm phân tích nghiệp vụ trong nhiều lĩnh vực: đào tạo trực tuyến, quản lý sản xuất, tài chính, hải quan, nhân sự, vận chuyển và cảng biển.",
      "10+ năm quản lý dự án phần mềm.",
      "Chứng chỉ quản lý dự án quốc tế PMP do PMI Hoa Kỳ cấp.",
    ],
    image: "/images/leadership/nguyen-huu-chu-restored.png",
  },
  {
    id: "tran-nong-lam",
    name: "Trần Nông Lâm",
    role: "Phó Giám đốc phụ trách Sản xuất",
    summary: "15+ năm phát triển phần mềm",
    details: [
      "Trên 15 năm phát triển phần mềm với các công nghệ Microsoft: C# .NET, Silverlight, WCF, Web API và MS SQL Server.",
      "10 năm quản trị dự án, làm việc với khách hàng Mỹ, Anh và Úc.",
      "Kinh nghiệm phân tích nghiệp vụ.",
      "Kinh nghiệm triển khai hệ thống phần mềm trên Cloud, AWS và Azure.",
      "Kinh nghiệm về AI: nhận diện ảnh, nhận diện đối tượng và xử lý ngôn ngữ tự nhiên (NLP).",
      "Chứng chỉ quản lý dự án quốc tế PMP do Hoa Kỳ cấp.",
    ],
    image: "/images/leadership/tran-nong-lam-restored.png",
  },
  {
    id: "trinh-ngoc-bien",
    name: "Trịnh Ngọc Biên",
    role: "Giám đốc bán hàng",
    summary: "17 năm quản trị doanh nghiệp",
    details: [
      "17 năm kinh nghiệm quản trị doanh nghiệp, bao gồm kế toán, kế toán quản trị, kế toán trưởng, quản trị tài chính và phân tích kinh doanh.",
      "Quản lý dự án đầu tư, quản lý kênh phân phối, điều hành công ty phân phối và điều hành bán lẻ.",
      "Kinh nghiệm huấn luyện và đào tạo.",
      "MBA tại Solvay Business School.",
    ],
    image: "/images/leadership/trinh-ngoc-bien-restored.png",
  },
  {
    id: "tran-thi-hanh",
    name: "Trần Thị Hạnh",
    role: "Trưởng phòng phân tích nghiệp vụ",
    summary: "Gần 10 năm phân tích yêu cầu phần mềm",
    details: [
      "Gần 10 năm kinh nghiệm phân tích yêu cầu phần mềm.",
      "Hiểu rõ quy trình phát triển phần mềm và quy trình triển khai dự án công nghệ thông tin.",
      "Có khả năng mô hình và khái quát hóa các vấn đề trong hệ thống phức tạp như ERP, CRM.",
    ],
    image: "/images/leadership/tran-thi-hanh-restored.png",
  },
  {
    id: "trinh-ba-ngoc",
    name: "Trịnh Bá Ngọc",
    role: "Quản lý dự án",
    summary: "8+ năm phát triển sản phẩm e-learning",
    details: [
      "8+ năm kinh nghiệm phát triển sản phẩm e-learning cho khách hàng Mỹ.",
      "Nhiều kinh nghiệm triển khai CRM/ERP cho các doanh nghiệp tại Việt Nam.",
      "5+ năm kinh nghiệm quản lý dự án phần mềm.",
    ],
    image: "/images/leadership/trinh-ba-ngoc-restored.png",
  },
];

export const leadershipTeam: readonly LeadershipProfile[] = profiles.map(profile => ({
  ...profile,
  title: profile.name,
  description: profile.role,
  imageAlt: `Chân dung ${profile.name}`,
}));
