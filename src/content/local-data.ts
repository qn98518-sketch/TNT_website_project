import type {
  ArticleRecord,
  FaqRecord,
  GuideRecord,
  AboutPageContent,
  FoodSolutionPageContent,
  HomePageContent,
  ProjectRecord,
  ServiceRecord,
} from "@/content/models";

export const services: readonly ServiceRecord[] = [
  {
    slug: "erp",
    title: "TNM ERP",
    eyebrow: "NỀN TẢNG QUẢN TRỊ",
    summary:
      "Làm rõ cách kết nối dữ liệu quản trị và vận hành theo quy trình của doanh nghiệp.",
    href: "/dich-vu/erp",
    points: ["Đánh giá nhu cầu", "Phân loại mức độ phù hợp", "Thống nhất phạm vi"],
    status: "approved",
  },
  {
    slug: "outsourcing",
    title: "Phát triển phần mềm",
    eyebrow: "PHÁT TRIỂN THEO NHU CẦU",
    summary:
      "Trao đổi về nhu cầu xây dựng hoặc mở rộng phần mềm theo mục tiêu và phạm vi cụ thể.",
    href: "/dich-vu/outsourcing",
    points: ["Làm rõ yêu cầu", "Thống nhất phạm vi", "Trao đổi cách thực hiện"],
    status: "approved",
  },
  {
    slug: "body-shop",
    title: "Nhân lực công nghệ",
    eyebrow: "NĂNG LỰC DỰ ÁN",
    summary:
      "Xác định vai trò và kỹ năng cần thiết theo nhu cầu cụ thể của dự án.",
    href: "/dich-vu/body-shop",
    points: ["Làm rõ vai trò", "Trao đổi năng lực cần có", "Thống nhất cách phối hợp"],
    status: "approved",
  },
];

export const projects: readonly ProjectRecord[] = [];

export const articles: readonly ArticleRecord[] = [];

export const guides: readonly GuideRecord[] = [];

export const homePageContent: HomePageContent = {
  hero: {
    eyebrow: "TRÍ NGHĨA TECH",
    title: "Kiến tạo công nghệ.",
    accent: "Thúc đẩy tăng trưởng.",
    summary:
      "TNT kết nối công nghệ với hoạt động kinh doanh qua TNM ERP, phát triển phần mềm và nhân lực CNTT — bắt đầu từ việc hiểu đúng nhu cầu vận hành.",
  },
  introduction: {
    eyebrow: "CÔNG NGHỆ TOÀN DIỆN",
    title: "Một đối tác công nghệ,",
    accent: "nhiều hướng giải quyết.",
    summary:
      "Mỗi doanh nghiệp có quy trình và ưu tiên riêng. TNT cùng bạn làm rõ nhu cầu trước khi lựa chọn giải pháp, dịch vụ và cách triển khai.",
  },
  reasons: [
    {
      title: "Bắt đầu từ quy trình",
      description:
        "Làm rõ cách công việc đang diễn ra trước khi đề xuất công cụ hay phạm vi triển khai.",
    },
    {
      title: "Ưu tiên mức độ phù hợp",
      description:
        "Phân biệt phần có thể đáp ứng, phần cần mở rộng và phần chưa thuộc phạm vi.",
    },
    {
      title: "Minh bạch quyết định",
      description:
        "Thống nhất nhu cầu, ưu tiên và các điểm cần xác nhận trước khi đi vào thực hiện.",
    },
  ],
  process: [
    { title: "Lắng nghe", description: "Tiếp nhận mục tiêu và bối cảnh vận hành." },
    { title: "Phân tích", description: "Làm rõ quy trình, dữ liệu và điểm cần cải thiện." },
    { title: "Thống nhất", description: "Trao đổi phương án, phạm vi và ưu tiên." },
    { title: "Đồng hành", description: "Thực hiện theo phạm vi đã thống nhất." },
  ],
  fitPrinciple: {
    eyebrow: "NGUYÊN TẮC ĐỀ XUẤT",
    title: "Fit first. Customize with purpose.",
    summary:
      "Ưu tiên phần phù hợp trước; chỉ mở rộng khi nhu cầu và giá trị được làm rõ.",
    linkLabel: "Tìm hiểu về TNT",
  },
  industry: {
    eyebrow: "GIẢI PHÁP NGÀNH THỰC PHẨM",
    title: "Dữ liệu liền mạch",
    accent: "cho vận hành nhà máy.",
    summary:
      "Tìm hiểu cách tiếp cận kết nối nguyên vật liệu, kho, sản xuất, chất lượng và thành phẩm — với phạm vi được làm rõ theo từng nhu cầu.",
    linkLabel: "Khám phá giải pháp",
  },
  projectDisclosure: {
    eyebrow: "DỰ ÁN & MINH CHỨNG",
    title: "Chỉ chia sẻ điều",
    accent: "đã được xác nhận.",
    summary:
      "TNT chỉ giới thiệu dự án khi bối cảnh, phạm vi và quyền công bố đã được xác nhận. Thông tin khách hàng, hình ảnh và kết quả sẽ được cập nhật sau khi được duyệt.",
  },
  proofChecks: [
    {
      title: "Bối cảnh",
      description: "Bài toán và phạm vi cần được mô tả chính xác.",
    },
    {
      title: "Minh chứng",
      description: "Kết quả chỉ xuất hiện khi có dữ liệu được xác nhận.",
    },
    {
      title: "Quyền công bố",
      description: "Khách hàng và tư liệu chỉ được nêu khi được cho phép.",
    },
  ],
  insightPrompts: [
    {
      topic: "ERP & VẬN HÀNH",
      question: "Dữ liệu nào cần được kết nối trước?",
      description:
        "Bắt đầu từ nơi phát sinh dữ liệu và ai cần sử dụng dữ liệu đó trong công việc hàng ngày.",
    },
    {
      topic: "SẢN XUẤT",
      question: "Điều gì đang làm chậm quyết định?",
      description:
        "Xác định điểm cần quan sát rõ hơn trước khi chọn cách thu thập hay trình bày thông tin.",
    },
    {
      topic: "PHẠM VI TRIỂN KHAI",
      question: "Phần nào nên làm trước?",
      description:
        "Làm rõ ưu tiên, mức độ phù hợp và những nội dung cần thống nhất trước khi mở rộng.",
    },
  ],
};

export const aboutPageContent: AboutPageContent = {
  hero: {
    eyebrow: "VỀ TRÍ NGHĨA TECH",
    title: "Hiểu nghiệp vụ trước.",
    accent: "Đề xuất giải pháp sau.",
    summary:
      "TNT hướng đến việc kết nối công nghệ với nhu cầu vận hành thực tế — qua TNM ERP, phát triển phần mềm và nhân lực công nghệ.",
  },
  overview: {
    eyebrow: "CÔNG NGHỆ PHỤC VỤ VẬN HÀNH",
    title: "Bắt đầu bằng việc",
    accent: "hiểu đúng nhu cầu.",
    paragraphs: [
      "Một giải pháp chỉ có ý nghĩa khi phù hợp với cách doanh nghiệp làm việc, dữ liệu họ cần và mục tiêu họ đang theo đuổi. Vì vậy, cuộc trao đổi đầu tiên cần làm rõ hiện trạng trước khi đi đến lựa chọn công nghệ.",
      "Với các bài toán sản xuất và chế biến thực phẩm, phạm vi thường được xem xét theo dòng công việc từ nguyên vật liệu, kho, sản xuất đến chất lượng và thành phẩm. Cách tiếp cận cụ thể cần được xác nhận theo từng doanh nghiệp.",
    ],
  },
  fitPrinciple: {
    eyebrow: "FIT FIRST. CUSTOMIZE WITH PURPOSE.",
    title: "Phù hợp trước.",
    accent: "Mở rộng có mục đích.",
    summary:
      "Mỗi yêu cầu được trao đổi theo mức độ phù hợp và phạm vi đã thống nhất — không mặc định mọi vấn đề đều cần tùy chỉnh.",
  },
  fitStages: [
    {
      label: "01 / SẴN CÓ",
      title: "Phù hợp",
      description:
        "Xác định phần nhu cầu có thể đáp ứng theo năng lực và cấu hình hiện có.",
    },
    {
      label: "02 / CẦN ĐÁNH GIÁ",
      title: "Cần mở rộng",
      description:
        "Làm rõ lợi ích, độ phức tạp và ưu tiên trước khi xem xét phát triển thêm.",
    },
    {
      label: "03 / NGOÀI PHẠM VI",
      title: "Chưa phù hợp",
      description:
        "Nêu rõ nội dung chưa nằm trong phạm vi để các bên có cơ sở thống nhất bước tiếp theo.",
    },
  ],
  capabilities: [
    {
      title: "TNM ERP",
      description:
        "Trao đổi về cách kết nối quy trình quản trị và vận hành theo nhu cầu doanh nghiệp.",
    },
    {
      title: "Phát triển phần mềm",
      description:
        "Làm rõ yêu cầu, phạm vi và hướng phát triển phần mềm phù hợp với mục tiêu.",
    },
    {
      title: "Nhân lực công nghệ",
      description:
        "Xác định vai trò và năng lực cần thiết theo nhu cầu cụ thể của dự án.",
    },
  ],
  teamDisclosure: {
    eyebrow: "ĐỘI NGŨ ĐỒNG HÀNH",
    title: "Đúng vai trò,",
    accent: "đúng giai đoạn.",
    summary:
      "Thành viên, chức danh và hình ảnh đội ngũ sẽ được giới thiệu sau khi TNT xác nhận thông tin và quyền sử dụng.",
  },
  teamRoles: [
    { title: "Nghiệp vụ", description: "Làm rõ mục tiêu và quy trình cần hỗ trợ." },
    { title: "Kỹ thuật", description: "Đánh giá hướng giải pháp và các nội dung cần kết nối." },
    { title: "Kiểm thử", description: "Xem xét yêu cầu và cách xác nhận kết quả." },
    { title: "Điều phối", description: "Thống nhất trao đổi, ưu tiên và phạm vi công việc." },
  ],
};

export const foodSolutionPageContent: FoodSolutionPageContent = {
  hero: {
    eyebrow: "GIẢI PHÁP NGÀNH THỰC PHẨM",
    title: ["Sản xuất bao nhiêu,", "hao hụt ở đâu,", "tồn kho thế nào?"],
    summary:
      "Cùng nhìn rõ dòng dữ liệu từ nguyên vật liệu đến thành phẩm — để xác định ưu tiên quản lý phù hợp với nhà máy của bạn.",
  },
  challenges: [
    {
      title: "Nguyên vật liệu & tồn kho",
      description:
        "Theo dõi thông tin nhập, xuất và mức tồn theo cách phù hợp với quy trình của nhà máy.",
    },
    {
      title: "Tiến độ sản xuất",
      description:
        "Làm rõ kế hoạch, tình trạng thực hiện và dữ liệu cần cập nhật giữa các công đoạn.",
    },
    {
      title: "Hao hụt & chi phí",
      description:
        "Xác định dữ liệu cần ghi nhận để xem xét định mức, tiêu hao và chi phí theo phạm vi.",
    },
    {
      title: "Chất lượng & thông tin theo lô",
      description:
        "Trao đổi yêu cầu ghi nhận chất lượng và liên kết thông tin theo lô sản xuất.",
    },
  ],
  workflow: [
    "Nguyên liệu",
    "Kho",
    "Sản xuất",
    "Chất lượng",
    "Thành phẩm",
    "Báo cáo",
  ],
  implementation: [
    {
      title: "Tìm hiểu hiện trạng",
      description: "Làm rõ mục tiêu, quy trình và điểm đang gặp vướng mắc.",
    },
    {
      title: "Đối chiếu mức độ phù hợp",
      description:
        "Xem xét dữ liệu, chức năng và nhu cầu theo từng bước vận hành.",
    },
    {
      title: "Thống nhất phạm vi",
      description:
        "Phân loại nội dung, ưu tiên và các điểm cần xác nhận trước khi thực hiện.",
    },
    {
      title: "Lập phương án triển khai",
      description:
        "Thống nhất lộ trình, trách nhiệm và cách đánh giá theo phạm vi được duyệt.",
    },
  ],
  faqs: [
    {
      id: "food-process-change",
      question: "Nhà máy có cần thay đổi toàn bộ cách vận hành không?",
      answer:
        "Không mặc định. Trước tiên cần tìm hiểu quy trình hiện tại và xác định phần nào có thể giữ nguyên, phần nào cần điều chỉnh để phù hợp với mục tiêu đã thống nhất.",
    },
    {
      id: "food-priorities",
      question: "Có thể bắt đầu với một số quy trình ưu tiên không?",
      answer:
        "Phạm vi có thể được trao đổi theo mức độ ưu tiên và sự phụ thuộc giữa các quy trình. Lộ trình cụ thể cần được TNT và doanh nghiệp thống nhất sau khi khảo sát nhu cầu.",
    },
    {
      id: "food-erp-modules",
      question: "TNM ERP hỗ trợ những phân hệ nào?",
      answer:
        "Phạm vi và khả năng của từng phân hệ cần được TNT xác nhận theo phiên bản, yêu cầu nghiệp vụ và cách triển khai. Buổi trao đổi ban đầu giúp xác định những nội dung cần đánh giá.",
    },
    {
      id: "food-cost-time",
      question: "Chi phí và thời gian triển khai được xác định như thế nào?",
      answer:
        "Chi phí và thời gian phụ thuộc vào quy trình, dữ liệu, phạm vi chức năng và các yêu cầu tích hợp. Các thông tin này chỉ nên được đưa ra sau khi nhu cầu được làm rõ.",
    },
  ],
};

export const faqs: readonly FaqRecord[] = [
  {
    id: "food-process-change",
    question: "Nhà máy có cần thay đổi toàn bộ cách vận hành không?",
    answer:
      "Không mặc định. Cần tìm hiểu quy trình hiện tại trước, sau đó xác định phần có thể giữ nguyên và phần cần điều chỉnh theo mục tiêu đã thống nhất.",
    topic: "Sản xuất",
    status: "approved",
  },
  {
    id: "implementation-scope",
    question: "Có thể bắt đầu với một số quy trình ưu tiên không?",
    answer:
      "Phạm vi có thể được trao đổi theo mức độ ưu tiên và sự phụ thuộc giữa các quy trình. Lộ trình cụ thể cần được thống nhất sau khi khảo sát nhu cầu.",
    topic: "ERP",
    status: "approved",
  },
  {
    id: "tnm-modules",
    question: "TNM ERP hỗ trợ những phân hệ nào?",
    answer:
      "Phạm vi và khả năng của từng phân hệ cần được TNT xác nhận theo phiên bản, yêu cầu nghiệp vụ và cách triển khai. Buổi trao đổi ban đầu giúp xác định nội dung cần đánh giá.",
    topic: "ERP",
    status: "approved",
  },
  {
    id: "delivery-timing",
    question: "Chi phí và thời gian triển khai được xác định như thế nào?",
    answer:
      "Chi phí và thời gian phụ thuộc vào quy trình, dữ liệu, phạm vi chức năng và yêu cầu tích hợp. Các thông tin này chỉ nên được đưa ra sau khi nhu cầu được làm rõ.",
    topic: "ERP",
    status: "approved",
  },
  {
    id: "staffing-roles",
    question: "Có thể trao đổi về vai trò hoặc kỹ năng cần cho dự án không?",
    answer:
      "Có thể bắt đầu bằng việc làm rõ vai trò, kỹ năng, thời điểm và cách phối hợp cần thiết. Nguồn lực và hình thức làm việc cụ thể cần TNT xác nhận.",
    topic: "Body Shop",
    status: "approved",
  },
  {
    id: "software-scope",
    question: "Làm thế nào để xác định phạm vi phần mềm?",
    answer:
      "Cần làm rõ mục tiêu, người sử dụng, quy trình và các hệ thống liên quan trước khi thống nhất phạm vi. Các dịch vụ và năng lực cụ thể cần được TNT xác nhận.",
    topic: "Outsourcing",
    status: "approved",
  },
];
