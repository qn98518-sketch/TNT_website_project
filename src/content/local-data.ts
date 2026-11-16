import { seafoodProject } from "@/content/seafood-project";
import { leadershipTeam } from "@/content/leadership";
import { migratedArticles, migratedProjects } from "@/content/migrated-content";
import type {
  ArticleRecord,
  FaqRecord,
  GuideRecord,
  AboutPageContent,
  FoodSolutionPageContent,
  HomePageContent,
  ProjectRecord,
  ServiceRecord,
  ServiceLandingContent,
} from "@/content/models";

export const services: readonly ServiceRecord[] = [
  {
    slug: "erp",
    title: "ERP",
    eyebrow: "NỀN TẢNG QUẢN TRỊ",
    summary:
      "Đồng bộ các nghiệp vụ quản trị, sản xuất, kho và dữ liệu vận hành.",
    href: "/dich-vu/erp",
    points: ["Đánh giá nhu cầu", "Phân loại mức độ phù hợp", "Thống nhất phạm vi"],
    status: "approved",
  },
  {
    slug: "outsourcing",
    title: "Outsourcing",
    eyebrow: "PHÁT TRIỂN THEO NHU CẦU",
    summary:
      "Phát triển phần mềm theo bài toán và yêu cầu riêng của doanh nghiệp.",
    href: "/dich-vu/outsourcing",
    points: ["Làm rõ yêu cầu", "Thống nhất phạm vi", "Trao đổi cách thực hiện"],
    status: "approved",
  },
  {
    slug: "body-shop",
    title: "Body Shop",
    eyebrow: "NĂNG LỰC DỰ ÁN",
    summary:
      "Bổ sung nhân lực CNTT phù hợp cho các giai đoạn triển khai dự án.",
    href: "/dich-vu/body-shop",
    points: ["Làm rõ vai trò", "Trao đổi năng lực cần có", "Thống nhất cách phối hợp"],
    status: "approved",
  },
];

export const serviceLandingContent: Record<string, ServiceLandingContent> = {
  erp: {
    relatedArticleSlugs: migratedArticles.slice(0, 3).map(article => article.slug),
    hero: {
      eyebrow: "GIẢI PHÁP ERP / TNT",
      title: "Kết nối dữ liệu.",
      accent: "Kiểm soát vận hành.",
      summary:
        "Khám phá cách tiếp cận ERP giúp doanh nghiệp kết nối các nghiệp vụ quản lý, giảm dữ liệu rời rạc và xây dựng quy trình minh bạch.",
      image: "/images/computer-dashboard.webp",
      imageAlt: "Bảng điều khiển TNM ERP trên máy tính",
      ctaLabel: "Đăng ký tư vấn ERP",
      secondaryLabel: "Khám phá phân hệ",
    },
    sections: [
      {
        kind: "cards",
        eyebrow: "BÀI TOÁN DOANH NGHIỆP",
        title: "Doanh nghiệp đang",
        accent: "mắc kẹt ở đâu?",
        summary:
          "Những khó khăn phổ biến khi hệ thống quản trị chưa kết nối dữ liệu.",
        cards: [
          { icon: "data", title: "Dữ liệu phân tán", description: "Thông tin nằm ở nhiều bảng tính và bộ phận riêng lẻ." },
          { icon: "boxSearch", title: "Thiếu kiểm soát kho", description: "Khó theo dõi nguyên vật liệu và tồn kho theo thời điểm." },
          { icon: "timer", title: "Tiến độ sản xuất", description: "Khó tổng hợp tình trạng kế hoạch, lệnh sản xuất." },
          { icon: "documentFilter", title: "Báo cáo chậm", description: "Tốn thời gian tổng hợp số liệu phục vụ điều hành." },
        ],
      },
      {
        kind: "flow",
        eyebrow: "GIẢI PHÁP TNM",
        title: "Từ dữ liệu rời rạc đến",
        accent: "vận hành liên thông",
        summary:
          "Một góc nhìn về việc kết nối dữ liệu giữa các nghiệp vụ cốt lõi.",
        before: [
          "Dữ liệu giữa các bộ phận tách biệt.",
          "Tổng hợp báo cáo thủ công.",
          "Khó theo dõi trên cùng một hệ thống.",
        ],
        after: [
          "Kết nối nghiệp vụ mua hàng, kho, sản xuất.",
          "Giảm nhập liệu trùng lặp.",
          "Báo cáo phục vụ ra quyết định.",
        ],
        stages: [
          { title: "Mua hàng", description: "Nghiệp vụ mua hàng" },
          { title: "Kho", description: "Tồn kho và luân chuyển" },
          { title: "Sản xuất", description: "Tiến độ và sản lượng" },
          { title: "Chất lượng", description: "Kiểm tra và theo dõi" },
          { title: "Bán hàng", description: "Đơn hàng và giao dịch" },
          { title: "Báo cáo", description: "Tổng hợp quản trị" },
        ],
      },
      {
        kind: "cards",
        eyebrow: "HỆ THỐNG / MODULE",
        title: "Các phân hệ quản trị",
        accent: "trên nền tảng TNM",
        summary:
          "Các phân hệ TNM giúp kết nối dữ liệu và quy trình quản trị doanh nghiệp.",
        cards: [
          { id: "erp-crm", icon: "profile", title: "Khách hàng / CRM", description: "Hỗ trợ tổ chức thông tin và nghiệp vụ liên quan đến khách hàng / CRM." },
          { id: "erp-mua-hang", icon: "bag", title: "Mua hàng", description: "Hỗ trợ tổ chức thông tin và nghiệp vụ liên quan đến mua hàng." },
          { id: "erp-kho", icon: "box", title: "Kho / WMS", description: "Hỗ trợ tổ chức thông tin và nghiệp vụ liên quan đến kho / WMS." },
          { icon: "settings", title: "Sản xuất / MES", description: "Hỗ trợ tổ chức thông tin và nghiệp vụ liên quan đến sản xuất / MES." },
          { icon: "shoppingCart", title: "Bán hàng", description: "Hỗ trợ tổ chức thông tin và nghiệp vụ liên quan đến bán hàng." },
          { icon: "wallet", title: "Tài chính", description: "Hỗ trợ tổ chức thông tin và nghiệp vụ liên quan đến tài chính." },
          { icon: "people", title: "Nhân sự", description: "Hỗ trợ tổ chức thông tin và nghiệp vụ liên quan đến nhân sự." },
          { icon: "taskSquare", title: "Dự án", description: "Hỗ trợ tổ chức thông tin và nghiệp vụ liên quan đến dự án." },
        ],
      },
      {
        kind: "cards",
        eyebrow: "FIT FIRST. CUSTOMIZE WITH PURPOSE.",
        title: "Không phải mọi doanh nghiệp",
        accent: "đều cần cùng một cấu hình.",
        summary:
          "Cấu trúc triển khai định hướng: rõ phần sẵn có, phần cần điều chỉnh và phần ngoài phạm vi.",
        cards: [
          { icon: "tickCircle", title: "READY — Sẵn sàng sử dụng", description: "Những nghiệp vụ phù hợp hiện trạng và nhu cầu ưu tiên." },
          { icon: "setting", title: "EXTEND — Cần điều chỉnh", description: "Phạm vi mở rộng hoặc bổ sung theo quy trình riêng." },
          { icon: "closeSquare", title: "OUT OF SCOPE — Ngoài phạm vi", description: "Các yêu cầu khác biệt cần đánh giá trước khi cam kết." },
        ],
      },
      {
        kind: "image-callout",
        eyebrow: "GIẢI PHÁP CHUYÊN NGÀNH",
        title: "Đồng hành cùng doanh nghiệp",
        accent: "chế biến thực phẩm",
        summary:
          "Quản lý mua hàng, nguyên liệu, sản xuất, kho và báo cáo trên cơ sở dữ liệu được tổ chức và kết nối. Trang giải pháp ngành thực phẩm do TNT cung cấp riêng.",
        image: "/images/food_process_factory.webp",
        imageAlt: "Nhà máy chế biến thực phẩm",
        points: [
          "Phù hợp với quy trình vận hành thực tế",
          "Tập trung các nghiệp vụ ưu tiên",
          "Kế hoạch mở rộng theo giai đoạn",
        ],
        href: "/giai-phap-nganh-thuc-pham",
        linkLabel: "Trao đổi nhu cầu ngành thực phẩm",

      },
      {
        kind: "projects",
        eyebrow: "CÂU CHUYỆN DỰ ÁN",
        title: "Giải pháp thực tế.",
        summary:
          "Tìm hiểu bài toán kết nối dữ liệu và quản lý quy trình sản xuất.",
        projects: [
          ...migratedProjects.filter(project => ["kala", "kova"].includes(project.slug)).map(project => ({
            title: project.title, category: `${project.industry} · TNM ERP`,
            description: project.summary, image: project.image!, imageAlt: project.imageAlt!,
            href: `/du-an/${project.slug}`,
          })),
          {
            title: seafoodProject.title, category: "CHẾ BIẾN THỦY SẢN • TNM ERP",
            description: seafoodProject.summary, image: seafoodProject.image!, imageAlt: seafoodProject.imageAlt!,
            href: `/du-an/${seafoodProject.slug}`, disclosure: seafoodProject.sourceLabel,
          },
        ],
      },
      {
        kind: "faqs",
        eyebrow: "FAQ",
        title: "Những câu hỏi thường gặp",
        summary: "Giải đáp nhanh trước khi đăng ký trao đổi nhu cầu ERP.",
        faqs: [
          { question: "Giải pháp ERP có thể tùy chỉnh theo quy trình riêng không?", answer: "Phạm vi tùy chỉnh cần được TNT đánh giá theo hiện trạng, dữ liệu và mục tiêu triển khai thực tế." },
          { question: "Doanh nghiệp cần chuẩn bị gì để triển khai ERP?", answer: "Doanh nghiệp nên xác định quy trình ưu tiên, dữ liệu hiện có và đầu mối phối hợp với nhóm triển khai." },
          { question: "Có thể kết nối với phần mềm đang sử dụng không?", answer: "Khả năng tích hợp phụ thuộc nền tảng, giao thức kết nối và phạm vi dự án đã thống nhất." },
        ],
      },
    ],
    contact: {
      title: "Bắt đầu từ bài toán vận hành của bạn",
      description: "Chia sẻ bài toán vận hành. TNT sẽ cùng bạn tìm hướng tiếp cận phù hợp.",
    },
  },
  outsourcing: {
    relatedArticleSlugs: ["chuyen-doi-so-truong-pho-thong", "khi-nao-outsourcing"],
    hero: {
      eyebrow: "DỊCH VỤ PHÁT TRIỂN PHẦN MỀM",
      title: "Từ ý tưởng đến",
      accent: "sản phẩm vận hành thực tế.",
      summary:
        "TNT đồng hành cùng doanh nghiệp trong quá trình phân tích, xây dựng và phát triển các giải pháp phần mềm theo yêu cầu.",
      image: "/images/business_technology.webp",
      imageAlt: "Phát triển phần mềm",
      ctaLabel: "Gửi yêu cầu dự án",
      secondaryLabel: "Xem phạm vi dịch vụ",
    },
    sections: [
      {
        kind: "cards",
        eyebrow: "KHI NÀO CẦN OUTSOURCING?",
        title: "Đúng bài toán.",
        accent: "Đúng nguồn lực.",
        summary: "Ba tình huống thường gặp khi doanh nghiệp tìm đối tác công nghệ.",
        cards: [
          { icon: "codeCircle", title: "Phát triển hệ thống mới", description: "Xây dựng phần mềm đáp ứng quy trình và mục tiêu kinh doanh." },
          { icon: "layer", title: "Mở rộng hệ thống hiện có", description: "Bổ sung chức năng, tích hợp dữ liệu và cải tiến trải nghiệm." },
          { icon: "people", title: "Cần đối tác triển khai", description: "Bổ sung năng lực thực hiện theo phạm vi dự án đã xác định." },
        ],
      },
      {
        kind: "cards",
        eyebrow: "NĂNG LỰC DỊCH VỤ",
        title: "Những hạng mục TNT",
        accent: "có thể đồng hành",
        summary: "Các hạng mục phát triển phần mềm theo nhu cầu doanh nghiệp.",
        cards: [
          { icon: "code", title: "Phần mềm theo yêu cầu", description: "Phát triển hệ thống phù hợp với quy trình doanh nghiệp." },
          { icon: "mobile", title: "Ứng dụng Web / Mobile", description: "Xây dựng trải nghiệm trên nền tảng web và thiết bị di động." },
          { icon: "link", title: "Tích hợp hệ thống", description: "Kết nối API, dữ liệu và nghiệp vụ giữa các hệ thống." },
          { icon: "convert", title: "Chuyển đổi dữ liệu", description: "Rà soát, chuẩn hóa và di chuyển dữ liệu theo kế hoạch." },
          { icon: "cpu", title: "Ứng dụng AI", description: "Tích hợp các chức năng AI khi phù hợp phạm vi dự án." },
        ],
      },
      {
        kind: "steps",
        eyebrow: "FIT / BUILD / DELIVER",
        title: "Quy trình rõ ràng.",
        accent: "Phối hợp minh bạch.",
        summary: "Sáu giai đoạn triển khai phần mềm theo nhu cầu doanh nghiệp.",
        steps: [
          { title: "Khảo sát", description: "Làm rõ mục tiêu và hiện trạng.", icon: "search" },
          { title: "Phân tích", description: "Xác định yêu cầu và phạm vi.", icon: "chart" },
          { title: "Thiết kế", description: "Thiết kế trải nghiệm và giải pháp.", icon: "diagram" },
          { title: "Phát triển", description: "Lập trình và tích hợp.", icon: "code" },
          { title: "Kiểm thử", description: "Kiểm soát chất lượng.", icon: "shield" },
          { title: "Bàn giao", description: "Nghiệm thu và hỗ trợ.", icon: "briefcase" },
        ],
      },
      {
        kind: "image-callout",
        eyebrow: "CON NGƯỜI & CÔNG NGHỆ",
        title: "Năng lực triển khai",
        accent: "gắn với hợp tác thực tế",
        summary:
          "Đội ngũ TNT phối hợp từ phân tích nghiệp vụ đến phát triển Frontend, Backend, Mobile, tích hợp dữ liệu và kiểm thử phần mềm.",
        image: "/images/solution.webp",
        imageAlt: "Đội ngũ trao đổi trong buổi tư vấn",
        points: ["Backend", "Frontend", "Mobile", "Data & API", "QA"],

      },
      {
        kind: "projects",
        eyebrow: "DỰ ÁN LIÊN QUAN",
        title: "Sản phẩm đã triển khai",
        summary: "Tìm hiểu các hệ thống TNT đã xây dựng cho giáo dục và hỗ trợ doanh nghiệp.",
        projects: migratedProjects.filter(project => ["cong-thong-tin-doanh-nghiep-ha-noi", "lomonoxop-my-dinh"].includes(project.slug)).map(project => ({
          title: project.title, category: project.industry, description: project.summary,
          image: project.image!, imageAlt: project.imageAlt!, href: `/du-an/${project.slug}`,
        })),
      },
    ],
    contact: {
      title: "Bạn đang tìm đối tác phát triển phần mềm?",
      description: "Chia sẻ bài toán vận hành. TNT sẽ cùng bạn tìm hướng tiếp cận phù hợp.",
    },
  },
  "body-shop": {
    hero: {
      eyebrow: "CUNG ỨNG NHÂN LỰC CNTT",
      title: "Đúng chuyên môn.",
      accent: "Đúng thời điểm dự án.",
      summary:
        "Linh hoạt bổ sung đội ngũ công nghệ theo vị trí và kỹ năng, giúp doanh nghiệp sắp xếp nguồn lực phù hợp với từng giai đoạn.",
      image: "/images/solution.webp",
      imageAlt: "Đội ngũ chuyên gia trao đổi tại văn phòng",
      ctaLabel: "Gửi yêu cầu nhân sự",
      secondaryLabel: "Khám phá vị trí",
    },
    sections: [
      {
        kind: "cards",
        eyebrow: "NHU CẦU NHÂN LỰC",
        title: "Mỗi giai đoạn dự án",
        accent: "cần nguồn lực phù hợp",
        summary: "Một số tình huống phổ biến khi doanh nghiệp bổ sung nhân sự CNTT.",
        cards: [
          { icon: "userRemove", title: "Thiếu nguồn lực triển khai", description: "Cần bổ sung nhân sự để đáp ứng tiến độ dự án." },
          { icon: "teacher", title: "Thiếu kỹ năng chuyên môn", description: "Cần nhân sự có năng lực theo công nghệ hoặc nghiệp vụ." },
          { icon: "userAdd", title: "Quy mô thay đổi theo giai đoạn", description: "Nhu cầu nhân sự có thể tăng, giảm theo phạm vi công việc." },
        ],
      },
      {
        kind: "cards",
        eyebrow: "NHÓM NHÂN SỰ",
        title: "Các vị trí CNTT",
        accent: "doanh nghiệp thường cần",
        summary: "Nhóm vị trí đề xuất theo thông tin dịch vụ nhân lực đã giới thiệu trên website cũ.",
        cards: [
          { icon: "code", title: "Developer", description: "Frontend / Backend / Full-stack theo yêu cầu kỹ năng của dự án." },
          { icon: "shieldSearch", title: "QA / Tester", description: "Kiểm thử chức năng, chất lượng và quy trình phần mềm." },
          { icon: "documentFilter", title: "Business Analyst", description: "Phân tích nghiệp vụ, xác định và mô tả yêu cầu hệ thống." },
        ],
      },
      {
        kind: "steps",
        eyebrow: "QUY TRÌNH HỢP TÁC",
        title: "Tiếp nhận rõ nhu cầu.",
        accent: "Phối hợp theo từng bước.",
        summary: "Luồng đề xuất cho hoạt động cung ứng nhân lực CNTT.",
        steps: [
          { title: "Tiếp nhận", description: "Vị trí, kỹ năng, số lượng." },
          { title: "Đề xuất", description: "Hồ sơ năng lực phù hợp." },
          { title: "Đánh giá", description: "Trao đổi và xác nhận." },
          { title: "Bắt đầu", description: "Onboarding và phối hợp." },
        ],
      },
      {
        kind: "cards",
        eyebrow: "MÔ HÌNH TRIỂN KHAI",
        title: "Linh hoạt theo phương thức",
        accent: "hợp tác được thống nhất",
        summary: "Lựa chọn hình thức phối hợp phù hợp với quy trình và nhu cầu của dự án.",
        cards: [
          { icon: "building4", title: "Làm việc tại đơn vị", description: "Phối hợp trực tiếp tại địa điểm phù hợp với thỏa thuận." },
          { icon: "global", title: "Làm việc từ xa", description: "Phối hợp qua quy trình, công cụ và cơ chế bảo mật." },
          { icon: "hierarchy", title: "Mô hình kết hợp", description: "Linh hoạt kết hợp tùy mục tiêu dự án và điều kiện thực tế." },
        ],
      },
      {
        kind: "image-callout",
        eyebrow: "NĂNG LỰC ĐỘI NGŨ",
        title: "Đồng hành cùng",
        accent: "đội dự án của bạn",
        summary: "Tìm hiểu cách đánh giá kỹ năng và phối hợp cùng đội ngũ dự án.",
        image: "/images/education.webp",
        imageAlt: "Đội ngũ dự án trao đổi cùng nhau",
        points: [
          "Làm rõ kỹ năng cần thiết",
          "Thống nhất phương thức phối hợp",
          "Trao đổi yêu cầu theo dự án",
        ],

      },
    ],
    contact: {
      title: "Bạn đang cần bổ sung nhân lực CNTT?",
      description: "Chia sẻ bài toán vận hành. TNT sẽ cùng bạn tìm hướng tiếp cận phù hợp.",
    },
  },
};

export const projects: readonly ProjectRecord[] = [
  seafoodProject,
  ...migratedProjects,
  {
    slug: "wood",
    title: "Hệ thống quản trị cho doanh nghiệp sản xuất gỗ",
    summary:
      "Số hóa quy trình và nâng cao khả năng kết nối thông tin giữa các bộ phận.",
    topic: "ERP",
    industry: "Sản xuất",
    service: "ERP",
    client: "Doanh nghiệp sản xuất gỗ (ẩn danh)",
    scope: "Quản trị quy trình sản xuất",
    challengeTitle: "Cần tổ chức dữ liệu hoạt động sản xuất",
    challenge:
      "Tổ chức dữ liệu sản xuất và kết nối thông tin giữa các bộ phận để hỗ trợ điều phối công việc.",
    solutionTitle: "Kết nối quản trị theo quy trình",
    solution: "Số hóa quy trình sản xuất và kết nối dữ liệu giữa các bộ phận trên một hệ thống quản trị.",
    approach: "Số hóa quy trình và nâng cao khả năng kết nối thông tin giữa các bộ phận.",
    outcome: "Hướng tới quy trình thống nhất và khả năng theo dõi thông tin sản xuất xuyên suốt.",
    image: "/images/wood_factory.webp",
    imageAlt: "Dự án quản trị cho doanh nghiệp sản xuất gỗ",
    status: "pending-review",
    relatedProjectSlugs: ["kala", "elearning"],
  },
  {
    slug: "recruitment",
    title: "Website tuyển dụng cho thị trường Nhật Bản",
    summary:
      "Phát triển hệ thống tuyển dụng dựa trên nhu cầu và nghiệp vụ khách hàng.",
    topic: "Outsourcing",
    industry: "Nhân sự",
    service: "Outsourcing",
    client: "Khách hàng thị trường Nhật Bản",
    scope: "Website / phát triển phần mềm",
    challengeTitle: "Xây dựng hệ thống phục vụ tuyển dụng",
    challenge: "Làm rõ nghiệp vụ tuyển dụng và yêu cầu sản phẩm theo mô hình khách hàng.",
    solutionTitle: "Phát triển website theo yêu cầu",
    solution:
      "Phân tích nghiệp vụ tuyển dụng, xây dựng chức năng và kiểm thử theo yêu cầu sản phẩm.",
    approach:
      "Phát triển hệ thống tuyển dụng dựa trên nhu cầu và nghiệp vụ khách hàng.",
    outcome: "Hướng tới trải nghiệm tuyển dụng thuận tiện và quy trình quản lý thông tin ứng viên rõ ràng.",
    image: "/images/business_technology.webp",
    imageAlt: "Website tuyển dụng",
    status: "pending-review",
    relatedProjectSlugs: ["wood", "elearning"],
  },
  {
    slug: "elearning",
    title: "Nền tảng đào tạo trực tuyến cho khách hàng quốc tế",
    summary:
      "Xây dựng giải pháp e-Learning phù hợp với mô hình vận hành đào tạo.",
    topic: "Outsourcing",
    industry: "Giáo dục",
    service: "Outsourcing",
    client: "Khách hàng quốc tế (ẩn danh)",
    scope: "Nền tảng e-Learning",
    challengeTitle: "Số hóa hoạt động đào tạo",
    challenge:
      "Nhu cầu xây dựng nền tảng học tập phù hợp với hình thức đào tạo trực tuyến.",
    solutionTitle: "Phát triển giải pháp e-Learning",
    solution: "Phân tích nhu cầu đào tạo, tổ chức nội dung học tập và phát triển chức năng phù hợp với mô hình vận hành.",
    approach:
      "Xây dựng giải pháp e-Learning phù hợp với mô hình vận hành đào tạo.",
    outcome: "Hướng tới việc tổ chức nội dung đào tạo và hỗ trợ học tập trực tuyến trên một nền tảng thống nhất.",
    image: "/images/education.webp",
    imageAlt: "Nền tảng đào tạo trực tuyến",
    status: "pending-review",
    relatedProjectSlugs: ["recruitment", "wood"],
  },
];

export const articles: readonly ArticleRecord[] = [
  ...migratedArticles,
  {
    slug: "erp-du-lieu",
    title: "ERP giúp doanh nghiệp sản xuất kết nối dữ liệu như thế nào?",
    summary:
      "Chia sẻ cách tổ chức dữ liệu vận hành thay cho các nguồn thông tin phân tán.",
    topic: "ERP",
    status: "pending-review",
    publishedAt: "2026-11-05",
    dateLabel: "05/11/2026",
    readingTime: "5 phút đọc",
    image: "/images/business_technology.webp",
    imageAlt: "Bài viết về kết nối dữ liệu ERP",
    thumbnail: "/images/food_process_factory.webp",
    thumbnailAlt: "Dữ liệu vận hành trong nhà máy",
    relatedArticleSlugs: ["chuan-bi-erp", "van-hanh-nha-may", "khi-nao-outsourcing"],
    sections: [
      {
        heading: "Dữ liệu là nền tảng của hoạt động quản trị",
        paragraphs: [
          "Trong nhiều doanh nghiệp, hoạt động mua hàng, sản xuất, kho và bán hàng có thể được quản lý bằng các nguồn dữ liệu khác nhau. Việc tổ chức và kết nối thông tin giúp người quản lý có một góc nhìn rõ hơn về hoạt động vận hành.",
          "Dữ liệu về mua hàng, sản xuất, kho và bán hàng thường được lưu ở nhiều nguồn. Khi được tổ chức theo một cấu trúc thống nhất, thông tin có thể phục vụ việc theo dõi hoạt động rõ ràng hơn.",
        ],
      },
      {
        heading: "Những điểm nghẽn thường gặp",
        paragraphs: [
          "Dữ liệu bị phân tán, nhập liệu lặp lại và thiếu cập nhật kịp thời thường gây khó khăn cho việc theo dõi tiến độ hoặc tổng hợp báo cáo.",
          "Dữ liệu phân tán, nhập liệu lặp lại và thiếu cập nhật kịp thời có thể khiến việc theo dõi tiến độ và tổng hợp báo cáo trở nên khó khăn.",
        ],
      },
      {
        heading: "Ưu tiên những nghiệp vụ có giá trị rõ ràng",
        paragraphs: [
          "Thay vì thay đổi toàn bộ hệ thống ngay lập tức, doanh nghiệp có thể xác định nghiệp vụ ưu tiên và khả năng kết nối dữ liệu trước khi chọn phạm vi triển khai.",
          "Doanh nghiệp có thể bắt đầu bằng những nghiệp vụ ưu tiên, kiểm tra khả năng kết nối dữ liệu và đánh giá mức độ phù hợp trước khi mở rộng.",
        ],
      },
      {
        heading: "Bước tiếp theo cho doanh nghiệp",
        paragraphs: [
          "Khảo sát hiện trạng và trao đổi với các bộ phận liên quan là cơ sở để xây dựng phương án quản trị phù hợp.",
          "Khảo sát hiện trạng cùng các bộ phận liên quan là cơ sở để lựa chọn phạm vi ERP phù hợp với mục tiêu vận hành.",
        ],
      },
    ],
    relatedServiceHref: "/dich-vu/erp",
    relatedServiceLabel: "Tìm hiểu ERP",
  },
  {
    slug: "chuan-bi-erp",
    title: "Những điểm cần chuẩn bị trước khi triển khai ERP",
    summary: "Từ khảo sát hiện trạng đến lựa chọn phạm vi phù hợp.",
    topic: "ERP",
    status: "pending-review",
    publishedAt: "2026-10-28",
    dateLabel: "28/10/2026",
    readingTime: "4 phút đọc",
    image: "/images/solution.webp",
    imageAlt: "Buổi trao đổi chuẩn bị triển khai ERP",
    thumbnail: "/images/business_technology.webp",
    thumbnailAlt: "Nhóm trao đổi về triển khai ERP",
    relatedArticleSlugs: ["erp-du-lieu", "van-hanh-nha-may"],
    sections: [
      {
        heading: "Bắt đầu từ mục tiêu kinh doanh",
        paragraphs: [
          "Trước khi tìm giải pháp ERP, doanh nghiệp cần thống nhất vấn đề nào đang gây khó khăn và mong muốn cải thiện ra sao.",
        ],
      },
      {
        heading: "Rà soát hiện trạng dữ liệu",
        paragraphs: [
          "Danh mục sản phẩm, khách hàng, nhà cung cấp và dữ liệu nghiệp vụ nên được rà soát để xác định chất lượng và khả năng chuyển đổi.",
        ],
      },
      {
        heading: "Làm rõ phạm vi triển khai",
        paragraphs: [
          "Chọn phân hệ và bộ phận ưu tiên, xác định đầu mối phụ trách, cùng các yêu cầu kết nối với hệ thống đang sử dụng.",
        ],
      },
      {
        heading: "Chuẩn bị kế hoạch phối hợp",
        paragraphs: [
          "Một kế hoạch trao đổi, kiểm thử và xác nhận dữ liệu giúp các bên làm việc theo từng giai đoạn cụ thể.",
        ],
      },
    ],
    relatedServiceHref: "/dich-vu/erp",
    relatedServiceLabel: "Trao đổi về ERP",
  },
  {
    slug: "van-hanh-nha-may",
    title: "Từ dữ liệu rời rạc đến vận hành nhà máy minh bạch",
    summary: "Một góc nhìn về quản lý nguyên liệu, kho và tiến độ sản xuất.",
    topic: "Sản xuất",
    status: "pending-review",
    publishedAt: "2026-10-17",
    dateLabel: "17/10/2026",
    readingTime: "4 phút đọc",
    image: "/images/glass_factory.webp",
    imageAlt: "Hoạt động nhà máy",
    thumbnail: "/images/work_factory.webp",
    thumbnailAlt: "Nhà máy sản xuất",
    relatedArticleSlugs: ["erp-du-lieu", "chuan-bi-erp", "chuyen-doi-so-nha-may-co-khi"],
    sections: [
      {
        heading: "Nhà máy cần nhìn thấy quy trình tổng thể",
        paragraphs: [
          "Dữ liệu nguyên liệu, kế hoạch, sản xuất và thành phẩm có liên quan chặt chẽ trong hoạt động vận hành.",
        ],
      },
      {
        heading: "Khi thông tin nằm ở nhiều bộ phận",
        paragraphs: [
          "Thông tin được cập nhật không đồng đều có thể làm chậm hoạt động tổng hợp và đối chiếu kết quả sản xuất.",
        ],
      },
      {
        heading: "Hướng tới dữ liệu nhất quán",
        paragraphs: [
          "Nên thống nhất cách quản lý mã hàng, lệnh sản xuất, công đoạn và chỉ số báo cáo để hỗ trợ trao đổi dữ liệu.",
        ],
      },
      {
        heading: "Chọn một phạm vi thử nghiệm",
        paragraphs: [
          "Bắt đầu với một quy trình ưu tiên có thể giúp doanh nghiệp đánh giá cách vận hành trước khi mở rộng.",
        ],
      },
    ],
    relatedServiceHref: "/giai-phap-nganh-thuc-pham",
    relatedServiceLabel: "Khám phá giải pháp nhà máy",
  },
  {
    slug: "khi-nao-outsourcing",
    title: "Outsourcing: khi nào doanh nghiệp nên hợp tác với đối tác phần mềm?",
    summary: "Lựa chọn mô hình triển khai phù hợp với quy mô dự án.",
    topic: "Outsourcing",
    status: "pending-review",
    publishedAt: "2026-10-08",
    dateLabel: "08/10/2026",
    readingTime: "4 phút đọc",
    image: "/images/ai_usage.webp",
    imageAlt: "Phát triển phần mềm",
    thumbnail: "/images/cloud_computing.webp",
    thumbnailAlt: "Phát triển phần mềm",
    relatedArticleSlugs: ["bo-sung-nhan-su", "erp-du-lieu"],
    sections: [
      {
        heading: "Xác định nhu cầu phát triển phần mềm",
        paragraphs: [
          "Doanh nghiệp có thể cần hệ thống mới, chức năng bổ sung hoặc đối tác hỗ trợ triển khai một phạm vi công việc đã xác định.",
        ],
      },
      {
        heading: "Rủi ro khi phạm vi chưa rõ",
        paragraphs: [
          "Kỳ vọng không thống nhất về chức năng, tích hợp và sản phẩm bàn giao dễ ảnh hưởng đến việc phối hợp thực hiện.",
        ],
      },
      {
        heading: "Làm rõ yêu cầu từ đầu",
        paragraphs: [
          "Cần thống nhất đối tượng sử dụng, quy trình nghiệp vụ, mốc kiểm tra và trách nhiệm của từng bên.",
        ],
      },
      {
        heading: "Trao đổi mô hình hợp tác phù hợp",
        paragraphs: [
          "Đề xuất phương án nên xuất phát từ phạm vi dự án thực tế, không áp dụng một mô hình giống nhau cho mọi doanh nghiệp.",
        ],
      },
    ],
    relatedServiceHref: "/dich-vu/outsourcing",
    relatedServiceLabel: "Tìm hiểu Outsourcing",
  },
  {
    slug: "quan-ly-kho",
    title: "Quản lý kho: những dữ liệu cần theo dõi thường xuyên",
    summary: "Các thông tin căn bản khi số hóa nghiệp vụ kho.",
    topic: "ERP",
    status: "pending-review",
    publishedAt: "2026-09-20",
    dateLabel: "20/09/2026",
    readingTime: "4 phút đọc",
    image: "/images/wood_factory.webp",
    imageAlt: "Quản lý kho",
    thumbnail: "/images/glass_factory.webp",
    thumbnailAlt: "Không gian nhà xưởng",
    relatedArticleSlugs: ["erp-du-lieu", "chuan-bi-erp", "quan-ly-kho-logistics"],
    sections: [
      {
        heading: "Thông tin kho cần được thống nhất",
        paragraphs: [
          "Các dữ liệu như danh mục hàng, đơn vị tính, số lượng và vị trí lưu trữ là cơ sở để theo dõi hàng tồn.",
        ],
      },
      {
        heading: "Những khó khăn phổ biến",
        paragraphs: [
          "Việc nhập xuất ở nhiều điểm nhưng không đối soát kịp thời có thể tạo chênh lệch giữa sổ sách và thực tế.",
        ],
      },
      {
        heading: "Tập trung vào quy trình nhập xuất",
        paragraphs: [
          "Xác định trách nhiệm phê duyệt, đối chiếu và cập nhật dữ liệu kho trước khi lựa chọn công cụ.",
        ],
      },
      {
        heading: "Kiểm thử với nghiệp vụ thực tế",
        paragraphs: [
          "Dùng những tình huống nhập, xuất, kiểm kê và điều chuyển thường gặp để đánh giá tính phù hợp của quy trình.",
        ],
      },
    ],
    relatedServiceHref: "/dich-vu/erp",
    relatedServiceLabel: "Trao đổi về quản lý kho",
  },
  {
    slug: "bo-sung-nhan-su",
    title: "Phát triển đội ngũ công nghệ linh hoạt theo dự án",
    summary: "Nhận diện nhu cầu kỹ năng và thời điểm bổ sung nhân sự.",
    topic: "Body Shop",
    status: "pending-review",
    publishedAt: "2026-09-12",
    dateLabel: "12/09/2026",
    readingTime: "4 phút đọc",
    image: "/images/education.webp",
    imageAlt: "Nhóm dự án công nghệ",
    thumbnail: "/images/solution.webp",
    thumbnailAlt: "Nhóm làm việc công nghệ",
    relatedArticleSlugs: ["khi-nao-outsourcing", "erp-du-lieu"],
    sections: [
      {
        heading: "Xác định khoảng thiếu hụt năng lực",
        paragraphs: [
          "Đội dự án có thể thiếu số lượng nhân sự hoặc thiếu kỹ năng chuyên môn tại một giai đoạn nhất định.",
        ],
      },
      {
        heading: "Không chỉ nhìn vào chức danh",
        paragraphs: [
          "Kỹ năng công nghệ, kinh nghiệm nghiệp vụ, hình thức phối hợp và khả năng đáp ứng cần được làm rõ.",
        ],
      },
      {
        heading: "Thống nhất cơ chế hợp tác",
        paragraphs: [
          "Mô hình phối hợp hiệu quả cần định nghĩa trách nhiệm công việc, phương thức báo cáo và cách đánh giá kết quả.",
        ],
      },
      {
        heading: "Đánh giá theo nhu cầu dự án",
        paragraphs: [
          "Bổ sung nguồn lực nên dựa trên kế hoạch, phạm vi và thời điểm triển khai đã được thống nhất.",
        ],
      },
    ],
    relatedServiceHref: "/dich-vu/body-shop",
    relatedServiceLabel: "Trao đổi về nhân lực CNTT",
  },
];

export const guides: readonly GuideRecord[] = [
  {
    slug: "tong-quan-trien-khai-erp",
    title: "Tổng quan triển khai ERP",
    summary: "Tài liệu giới thiệu các bước khảo sát và đánh giá phạm vi ERP.",
    topic: "ERP",
    status: "pending-review",
    fileUrl: "#guide-tong-quan-trien-khai-erp",
    fileType: "Hướng dẫn trực tuyến",
    image: "/images/computer-dashboard.webp",
    imageAlt: "Tài liệu triển khai ERP",
    preview: [
      "Làm rõ mục tiêu kinh doanh và vấn đề vận hành cần giải quyết.",
      "Rà soát quy trình hiện tại, dữ liệu và các hệ thống liên quan.",
      "Chọn phạm vi ưu tiên, đầu mối phối hợp và tiêu chí đánh giá.",
    ],
  },
  {
    slug: "checklist-du-lieu-nha-may",
    title: "Checklist chuẩn bị dữ liệu nhà máy",
    summary:
      "Danh sách vấn đề nên rà soát trước khi triển khai giải pháp quản trị.",
    topic: "Sản xuất",
    status: "pending-review",
    fileUrl: "#guide-checklist-du-lieu-nha-may",
    fileType: "Hướng dẫn trực tuyến",
    image: "/images/food_process_factory.webp",
    imageAlt: "Checklist dữ liệu nhà máy",
    preview: [
      "Danh mục nguyên liệu, thành phẩm, đơn vị tính và định mức.",
      "Quy trình nhập, xuất, điều chuyển và kiểm kê kho.",
      "Kế hoạch sản xuất, công đoạn, hao hụt và thông tin chất lượng.",
    ],
  },
  {
    slug: "mau-ghi-nhan-yeu-cau-phan-mem",
    title: "Mẫu ghi nhận yêu cầu phần mềm",
    summary:
      "Khung mô tả bài toán và phạm vi phát triển phần mềm theo yêu cầu.",
    topic: "Outsourcing",
    status: "pending-review",
    fileUrl: "#guide-mau-ghi-nhan-yeu-cau-phan-mem",
    fileType: "Hướng dẫn trực tuyến",
    image: "/images/business_technology.webp",
    imageAlt: "Mẫu yêu cầu phần mềm",
    preview: [
      "Mục tiêu và người sử dụng chính của phần mềm.",
      "Quy trình nghiệp vụ, chức năng cần có và hệ thống cần tích hợp.",
      "Ưu tiên, phạm vi bàn giao và cách xác nhận kết quả.",
    ],
  },
  {
    slug: "bo-cau-hoi-nhu-cau-nhan-luc",
    title: "Bộ câu hỏi đánh giá nhu cầu nhân lực",
    summary: "Gợi ý các thông tin đầu vào khi cần bổ sung nhân sự CNTT.",
    topic: "Body Shop",
    status: "pending-review",
    fileUrl: "#guide-bo-cau-hoi-nhu-cau-nhan-luc",
    fileType: "Hướng dẫn trực tuyến",
    image: "/images/education.webp",
    imageAlt: "Tài liệu nhu cầu nhân lực",
    preview: [
      "Vai trò, kỹ năng và kinh nghiệm cần thiết cho dự án.",
      "Thời điểm bắt đầu, thời lượng và quy mô nguồn lực.",
      "Mô hình phối hợp, địa điểm làm việc và trách nhiệm liên quan.",
    ],
  },
];

export const homePageContent: HomePageContent = {
  hero: {
    eyebrow: "TECHNOLOGY ENGINEERING PARTNER",
    title: "Kiến tạo công nghệ.",
    accent: "Thúc đẩy tăng trưởng.",
    summary:
      "TNT cung cấp giải pháp TNM ERP, dịch vụ phát triển phần mềm theo yêu cầu và nhân lực CNTT, đồng hành cùng doanh nghiệp từ ý tưởng đến triển khai thực tế.",
  },
  statistics: [
    { value: "8+", label: "năm kinh nghiệm", description: "Đồng hành cùng doanh nghiệp Việt Nam và quốc tế" },
    { value: "70+", label: "kỹ sư", description: "Đội ngũ giàu kinh nghiệm, chuyên môn vững vàng" },
    { value: "200+", label: "khách hàng", description: "Doanh nghiệp trong nhiều lĩnh vực" },
    { value: "300+", label: "dự án", description: "Đã triển khai thành công và đang vận hành" },
  ],
  erpModules: [
    { label: "Bán hàng", code: "CRM", icon: "shoppingCart" },
    { label: "Sản xuất", code: "MES", icon: "activity" },
    { label: "Kho", code: "WMS", icon: "box" },
    { label: "Mua hàng", code: "Procurement", icon: "bag" },
    { label: "Tài chính", code: "Finance", icon: "chart" },
    { label: "Nhân sự", code: "HRM", icon: "people" },
    { label: "Quản lý dự án", code: "Project Management", icon: "briefcase" },
  ],
  additionalServices: [
    { icon: "code", title: "Gia công phần mềm", description: "Phát triển phần mềm theo quy trình chuẩn, đảm bảo chất lượng và tiến độ.", href: "/dich-vu/outsourcing" },
    { icon: "codeCircle", title: "Phần mềm theo yêu cầu", description: "Thiết kế, phát triển giải pháp phù hợp với nghiệp vụ riêng.", href: "/dich-vu/outsourcing" },
    { icon: "profile", title: "Cung ứng nhân lực CNTT", description: "Đội ngũ kỹ sư tham gia dự án linh hoạt theo nhu cầu.", href: "/dich-vu/body-shop" },
    { icon: "cloud", title: "Hạ tầng Cloud & Hosting", description: "Hỗ trợ vận hành hạ tầng và hệ thống theo nhu cầu doanh nghiệp.", href: "/dich-vu" },
    { icon: "designTools", title: "Thiết kế UI/UX & Website", description: "Thiết kế trải nghiệm giao diện trực quan, dễ sử dụng.", href: "/dich-vu/outsourcing" },
  ],
  featuredInsights: migratedArticles.slice(0, 3).map(article => ({
    topic: article.topic,
    title: article.title,
    summary: article.summary,
    publishedAt: article.publishedAt,
    dateLabel: article.dateLabel,
    readingTime: article.readingTime,
    href: `/kien-thuc/blog/${article.slug}`,
    image: article.image!,
    imageAlt: article.imageAlt!,
  })),
  introduction: {
    eyebrow: "GIẢI PHÁP & DỊCH VỤ",
    title: "Công nghệ toàn diện",
    accent: "cho doanh nghiệp.",
    summary:
      "Từ nền tảng TNM ERP đến phần mềm, nhân lực và hạ tầng CNTT, TNT đồng hành cùng doanh nghiệp trên hành trình chuyển đổi số.",
  },
  reasons: [
    {
      title: "Hiểu bài toán doanh nghiệp",
      description:
        "Lắng nghe, phân tích và đưa ra giải pháp phù hợp với mục tiêu kinh doanh thực tế.",
    },
    {
      title: "Năng lực kỹ thuật vững vàng",
      description:
        "Đội ngũ giàu kinh nghiệm, thành thạo công nghệ hiện đại và luôn cập nhật xu hướng mới.",
    },
    {
      title: "Quy trình triển khai chuyên nghiệp",
      description:
        "Quy trình rõ ràng, minh bạch, đảm bảo chất lượng và tiến độ dự án.",
    },
    {
      title: "Đối tác đồng hành lâu dài",
      description:
        "Hướng đến mối quan hệ hợp tác bền vững, cùng phát triển và tạo giá trị lâu dài.",
    },
  ],
  process: [
    { title: "Tiếp nhận yêu cầu", description: "Lắng nghe nhu cầu, tìm hiểu hiện trạng và xác định mục tiêu của doanh nghiệp." },
    { title: "Phân tích & tư vấn", description: "Đánh giá hiện trạng, phân tích nhu cầu và đề xuất giải pháp phù hợp." },
    { title: "Triển khai phát triển", description: "Xây dựng, cấu hình và triển khai theo lộ trình, đảm bảo kết nối dữ liệu và vận hành ổn định." },
    { title: "Bàn giao & đồng hành", description: "Bàn giao, đào tạo và hỗ trợ vận hành, đồng hành để tối ưu và mở rộng khi cần." },
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
    title: "Kết nối công nghệ",
    accent: "với bài toán thực tế.",
    summary:
      "Khám phá cách tiếp cận bài toán doanh nghiệp qua các giải pháp quản trị và phát triển phần mềm.",
  },
  proofChecks: [
    {
      title: "Bối cảnh",
      description: "Bài toán và phạm vi cần được mô tả chính xác.",
    },
    {
      title: "Minh chứng",
      description: "Theo dõi hiệu quả thông qua dữ liệu vận hành.",
    },
    {
      title: "Phạm vi triển khai",
      description: "Làm rõ các hạng mục và mục tiêu của giải pháp.",
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
      "Trí Nghĩa (TNT) cung cấp giải pháp ERP và các dịch vụ công nghệ thông tin, giúp doanh nghiệp kết nối dữ liệu và quản lý hoạt động hiệu quả hơn.",
  },
  overview: {
    eyebrow: "VỀ TNT",
    title: "Công nghệ phục vụ nhu cầu",
    accent: "vận hành thực tế.",
    paragraphs: [
      "Trí Nghĩa (TNT) được thành lập từ năm 2017, cung cấp nền tảng quản trị TNM cho doanh nghiệp chế biến thực phẩm, cùng các dịch vụ phát triển phần mềm theo nhu cầu và cung ứng nhân sự công nghệ thông tin.",
    ],
    images: [
      {
        src: "/images/food_process_factory.webp",
        alt: "Dây chuyền sản xuất thực phẩm theo thiết kế khách hàng",
        width: 939,
        height: 278,
      },
      {
        src: "/images/solution.webp",
        alt: "Tư vấn giải pháp CNTT cùng nhà máy thực phẩm",
        width: 727,
        height: 302,
      },
    ],
  },
  industryCapabilities: [
    {
      title: "Hiểu quy trình ngành chế biến thực phẩm",
      description:
        "Tìm hiểu đặc thù vận hành, quy định và yêu cầu quản trị của ngành.",
    },
    {
      title: "Phát triển trên nền tảng TNM sẵn có",
      description:
        "Tận dụng nền tảng cho các dự án cần triển khai nhanh và ổn định.",
    },
    {
      title: "Chuẩn hóa các bước triển khai",
      description:
        "Xây dựng phương pháp làm việc rõ ràng, đảm bảo hiệu quả và tính bền vững.",
    },
  ],
  methodSteps: [
    {
      english: "CONNECT",
      title: "CONNECT",
      description:
        "Kết nối đúng người yêu cầu và các bộ phận vận hành để hiểu đúng nhu cầu.",
      icon: "message",
    },
    {
      english: "FIT",
      title: "FIT",
      description:
        "Tư vấn giải pháp phù hợp, linh hoạt theo đặc thù và quy trình vận hành.",
      icon: "diagram",
    },
    {
      english: "DELIVER",
      title: "DELIVER",
      description:
        "Triển khai minh bạch, đồng hành với kết quả và mang lại hiệu quả bền vững.",
      icon: "checklist",
    },
  ],
  statistics: [
    { value: "50+", label: "Developers" },
    { value: "10+", label: "Testers" },
    { value: "5+", label: "BA" },
    { value: "3+", label: "Chứng chỉ PMP" },
    { value: "2+", label: "UI/UX" },
  ],
  fitPrinciple: {
    eyebrow: "FIT FIRST. CUSTOMIZE WITH PURPOSE.",
    title: "Ưu tiên sự phù hợp.",
    accent: "Tùy chỉnh có mục đích.",
    summary: "Ưu tiên sự phù hợp. Tùy chỉnh có mục đích.",
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
      title: "TNM",
      description:
        "Nền tảng quản trị cho doanh nghiệp chế biến thực phẩm.",
    },
    {
      title: "Phát triển phần mềm",
      description:
        "Dịch vụ phát triển phần mềm theo nhu cầu.",
    },
    {
      title: "Cung ứng nhân sự CNTT",
      description:
        "Cung ứng nhân sự công nghệ thông tin.",
    },
  ],
  teamDisclosure: {
    eyebrow: "CON NGƯỜI TNT",
    title: "Đội ngũ",
    accent: "lãnh đạo.",
    summary: "Những người dẫn dắt định hướng, phát triển giải pháp và đồng hành cùng khách hàng.",
  },
  teamRoles: leadershipTeam,
};

export const foodSolutionPageContent: FoodSolutionPageContent = {
  hero: {
    eyebrow: "GIẢI PHÁP ERP CHO DOANH NGHIỆP CHẾ BIẾN THỰC PHẨM",
    title: ["Sản xuất bao nhiêu,", "hao hụt ở đâu,", "tồn kho thế nào?"],
    subtitle:
      "Quản lý nhà máy bằng dữ liệu kết nối, thay vì những file rời rạc.",
    summary:
      "TNT giúp doanh nghiệp đánh giá khả năng kết nối dữ liệu mua hàng, kho, sản xuất và chất lượng trên nền tảng TNM, lựa chọn những chức năng phù hợp và làm rõ các điều chỉnh cần thiết trước khi triển khai.",
    image: "/images/food_process_factory.webp",
    imageAlt: "Nhân viên nhà máy chế biến thực phẩm",
  },
  challenges: [
    {
      title: "Nguyên vật liệu & tồn kho",
      description:
        "Khó kiểm soát đầu vào, tồn kho, định mức và hạn sử dụng.",
    },
    {
      title: "Tiến độ sản xuất",
      description:
        "Khó cập nhật tiến độ, công đoạn và sản lượng theo kế hoạch.",
    },
    {
      title: "Hao hụt & chi phí",
      description:
        "Khó kiểm soát hao hụt nguyên liệu và chi phí thực tế.",
    },
    {
      title: "Chất lượng & thông tin theo lô",
      description:
        "Cơ sở dữ liệu chưa liên thông, truy vết nguồn gốc còn nhiều thao tác.",
    },
  ],
  workflow: [
    { title: "Nguyên vật liệu", description: "Tiếp nhận và kiểm soát đầu vào" },
    { title: "Kho", description: "Quản lý tồn và luân chuyển" },
    { title: "Sản xuất", description: "Tiến độ và tiêu hao" },
    { title: "Chất lượng", description: "Kiểm tra, ghi nhận và theo dõi" },
    { title: "Thành phẩm", description: "Nhập kho, chuẩn bị giao hàng" },
    { title: "Báo cáo", description: "Tổng hợp, phân tích vận hành" },
  ],
  workflowContext: {
    before: [
      "Dữ liệu rời rạc trên Excel, khó tổng hợp.",
      "Các bộ phận làm việc tách biệt, thông tin thiếu đồng nhất.",
      "Báo cáo chậm, khó nắm tình hình sản xuất và tồn kho.",
    ],
    after: [
      "Dữ liệu liên thông từ đơn hàng, kho, sản xuất đến chất lượng.",
      "Các phòng ban làm việc trên cùng nền tảng.",
      "Báo cáo kịp thời, hỗ trợ điều phối và tối ưu vận hành.",
    ],
  },
  fitStages: [
    {
      label: "READY – Sẵn sàng sử dụng",
      title: "Phù hợp",
      description:
        "Những nghiệp vụ TNM đã có thể áp dụng ngay hoặc chỉ cần cấu hình. Ví dụ: Mua hàng, quản lý kho, bán hàng, báo cáo quản trị.",
    },
    {
      label: "EXTEND – Cần điều chỉnh",
      title: "Cần điều chỉnh",
      description:
        "Những nghiệp vụ cần mở rộng, tích hợp hoặc điều chỉnh theo quy trình nhà máy. Ví dụ: Định mức, hao hụt, kiểm soát chất lượng, quản lý theo lô.",
    },
    {
      label: "OUT OF SCOPE – Ngoài phạm vi",
      title: "Ngoài phạm vi",
      description:
        "Những hạng mục chưa nằm trong phạm vi và ngân sách đề xuất cần được đánh giá thêm. Ví dụ: Các yêu cầu đặc thù chưa đủ thông tin để phân tích.",
    },
  ],
  partnership: [
    {
      title: "Hiểu nghiệp vụ",
      description: "Tập trung các yêu cầu thực tiễn trong nhà máy.",
    },
    {
      title: "Có nền tảng TNM",
      description: "Phát triển giải pháp trên nền tảng quản trị sẵn có.",
    },
    {
      title: "Đánh giá theo phạm vi rõ ràng",
      description:
        "Làm rõ những gì có sẵn, cần điều chỉnh hoặc chưa nên đầu tư.",
    },
    {
      title: "Đồng hành triển khai",
      description: "Từ tư vấn, rà soát đến hướng dẫn và bàn giao.",
    },
  ],
  projectDisclosure: {
    title: seafoodProject.title,
    summary: seafoodProject.summary,
    image: seafoodProject.image!,
    imageAlt: seafoodProject.imageAlt!,
  },
  implementation: [
    {
      title: "Khảo sát nhu cầu",
      description: "Tìm hiểu nhà máy, bộ phận và các vấn đề vận hành.",
    },
    {
      title: "Đánh giá khả năng đáp ứng",
      description:
        "Đối chiếu yêu cầu với nền tảng và phạm vi hiện có.",
    },
    {
      title: "Thống nhất phạm vi",
      description:
        "Làm rõ chức năng, điều chỉnh và chi phí.",
    },
    {
      title: "Cấu hình & triển khai",
      description:
        "Cấu hình hệ thống, hướng dẫn và phối hợp cùng đơn vị.",
    },
    {
      title: "Bàn giao & hỗ trợ",
      description: "Nghiệm thu, bàn giao và hướng dẫn tiếp tục vận hành.",
    },
  ],
  faqs: [
    {
      id: "food-sme",
      question: "ERP có phù hợp với doanh nghiệp vừa và nhỏ không?",
      answer:
        "Phạm vi triển khai phụ thuộc quy mô, yêu cầu nghiệp vụ và mức độ sẵn sàng của từng doanh nghiệp.",
    },
    {
      id: "food-process-change",
      question: "Có phải thay đổi toàn bộ quy trình hiện tại không?",
      answer:
        "TNT đánh giá tính phù hợp trước khi xác định phần cần thay đổi.",
    },
    {
      id: "food-cost",
      question: "Chi phí triển khai được xác định như thế nào?",
      answer:
        "Chi phí cần dựa trên phạm vi chức năng, tích hợp, điều chỉnh và hình thức triển khai được thống nhất.",
    },
    {
      id: "food-customization",
      question: "Có thể điều chỉnh theo nhu cầu riêng không?",
      answer:
        "Cần đánh giá mức độ phù hợp và khả năng mở rộng của từng nghiệp vụ.",
    },
    {
      id: "food-support",
      question: "Sau triển khai TNT có hỗ trợ vận hành không?",
      answer:
        "Phạm vi hỗ trợ sẽ được TNT và doanh nghiệp thống nhất trong kế hoạch hoặc hợp đồng triển khai.",
    },
  ],
};

export const faqs: readonly FaqRecord[] = [
  {
    id: "erp-customization",
    question: "ERP có thể tùy chỉnh theo quy trình đang vận hành không?",
    answer:
      "Có thể xem xét các phương án phù hợp dựa trên khảo sát và đánh giá phạm vi thực tế của TNT.",
    topic: "ERP",
    status: "pending-review",
  },
  {
    id: "erp-time",
    question: "Thời gian triển khai ERP được xác định như thế nào?",
    answer:
      "Phụ thuộc số lượng phân hệ, dữ liệu, mức độ tích hợp và phạm vi được hai bên thống nhất.",
    topic: "ERP",
    status: "pending-review",
  },
  {
    id: "replace-current-system",
    question: "Doanh nghiệp có cần thay toàn bộ phần mềm hiện tại không?",
    answer:
      "Không nhất thiết. Cần đánh giá hệ thống hiện có và lộ trình tích hợp/triển khai từng giai đoạn.",
    topic: "ERP",
    status: "pending-review",
  },
  {
    id: "outsourcing-analysis",
    question: "Outsourcing có bao gồm phân tích yêu cầu và kiểm thử?",
    answer:
      "Phạm vi công việc được xác định trong đề xuất và thỏa thuận triển khai cụ thể.",
    topic: "Outsourcing",
    status: "pending-review",
  },
  {
    id: "legacy-extension",
    question: "Có thể thuê ngoài phát triển thêm chức năng hệ thống cũ không?",
    answer:
      "Đây là nhu cầu có thể khảo sát; khả năng thực hiện phụ thuộc kiến trúc và quyền truy cập hệ thống.",
    topic: "Outsourcing",
    status: "pending-review",
  },
  {
    id: "body-shop-difference",
    question: "Body Shop khác Outsourcing ở điểm nào?",
    answer:
      "Body Shop tập trung bổ sung nhân lực CNTT, còn Outsourcing tập trung thực hiện một phạm vi công việc phần mềm.",
    topic: "Body Shop",
    status: "pending-review",
  },
  {
    id: "staffing-roles",
    question: "TNT có thể cung ứng những vị trí nhân sự nào?",
    answer:
      "Các vị trí gồm Developer, Tester và Business Analyst, được lựa chọn theo yêu cầu của dự án.",
    topic: "Body Shop",
    status: "pending-review",
  },
  {
    id: "request-quote",
    question: "Tôi muốn nhận báo giá thì liên hệ thế nào?",
    answer:
      "Bạn có thể gửi form tư vấn để TNT trao đổi nhu cầu và làm rõ phạm vi trước khi đề xuất.",
    topic: "Khác",
    status: "pending-review",
  },
];
