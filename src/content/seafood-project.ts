import type { ProjectRecord, ProjectStory } from "@/content/models";

// Source: TNT- DỰ ÁN TIÊU BIỂU.docx supplied by the site owner.
// This document describes an illustrative case, not a verified client project.
export const seafoodProject: ProjectRecord = {
  slug: "erp-che-bien-thuy-san",
  shortTitle: "Chế biến thủy sản",
  title: "Kết nối dữ liệu từ nguyên liệu đến thành phẩm trong chế biến thủy sản",
  detailTitle: "Triển khai ERP cho doanh nghiệp chế biến thủy sản: Kết nối dữ liệu từ nguyên liệu đến thành phẩm",
  summary: "Tìm hiểu cách TNM ERP được đề xuất để liên kết quản lý nguyên liệu, sản xuất, chất lượng và kho trên một hệ thống, với phạm vi tùy chỉnh phù hợp đặc thù vận hành.",
  topic: "ERP",
  industry: "Chế biến thủy sản đông lạnh",
  service: "TNM ERP – Mua hàng, kho, sản xuất, bán hàng",
  client: "Doanh nghiệp quy mô vừa (mô phỏng)",
  scope: "Quản lý theo lô, hao hụt và truy xuất nguồn gốc",
  challenge: "Dữ liệu thu mua, kho, sản xuất và chất lượng nằm trên nhiều bảng tính, gây khó khăn khi quản lý theo lô, đối chiếu hao hụt và truy xuất thành phẩm.",
  approach: "Ưu tiên phân hệ TNM hiện có; đánh giá riêng các yêu cầu đặc thù để xác định phạm vi cấu hình và tùy chỉnh cần thiết.",
  solution: "Kết nối quản lý nguyên liệu, kho, lệnh sản xuất, chất lượng và bán hàng trên TNM ERP, xuyên suốt từ lô nguyên liệu đến lô thành phẩm.",
  outcome: "Kỳ vọng minh bạch dữ liệu theo lô, kiểm soát hao hụt tốt hơn, giảm tổng hợp thủ công và hỗ trợ điều hành dựa trên dữ liệu.",
  image: "/images/projects/che-bien-thuy-san/quy-trinh-che-bien-thuy-san.png",
  imageAlt: "Quy trình chế biến thủy sản và kiểm soát chất lượng tại nhà máy",
  sourceLabel: "Case study mô phỏng",
  isSimulation: true,
  status: "pending-review",
  relatedProjectSlugs: ["kala", "wood"],
};

export const seafoodProjectStory: ProjectStory = {
  imageCaption: "Hình minh họa: Quy trình chế biến thủy sản và kiểm soát chất lượng tại nhà máy.",
  sections: [
    {
      id: "tong-quan",
      heading: "Tổng quan dự án",
      paragraphs: [
        "Trong ngành chế biến thủy sản, việc kiểm soát nguyên liệu, theo dõi sản xuất và truy xuất nguồn gốc theo từng lô là những yêu cầu quan trọng để duy trì chất lượng sản phẩm và hiệu quả vận hành.",
        "Đối với doanh nghiệp trong tình huống này, dữ liệu giữa bộ phận thu mua, kho, sản xuất và kiểm soát chất lượng được quản lý trên nhiều bảng tính và hệ thống riêng biệt. Điều đó khiến việc theo dõi nguyên liệu, đối chiếu hao hụt và truy xuất thông tin thành phẩm mất nhiều thời gian.",
        "TNT đề xuất triển khai nền tảng TNM ERP nhằm kết nối các nghiệp vụ trọng yếu trên một hệ thống thống nhất, đồng thời điều chỉnh những chức năng cần thiết theo đặc thù chế biến thủy sản mà không phát sinh tùy chỉnh ngoài phạm vi.",
      ],
    },
    {
      id: "bai-toan-van-hanh",
      heading: "1. Bài toán vận hành của doanh nghiệp",
      subsections: [
        {
          heading: "Khó khăn trong quản lý nguyên liệu theo lô",
          paragraphs: ["Nguyên liệu thủy sản được nhập từ nhiều nhà cung cấp, với thời điểm thu mua, chất lượng và điều kiện bảo quản khác nhau. Việc ghi nhận thông tin phân tán khiến doanh nghiệp khó theo dõi chính xác nguồn gốc và tình trạng từng lô."],
        },
        {
          heading: "Thiếu liên kết giữa kho và sản xuất",
          paragraphs: ["Thông tin nguyên liệu xuất kho, khối lượng sử dụng và sản lượng sau chế biến chưa được cập nhật đồng bộ. Bộ phận quản lý phải đối chiếu thủ công để xác định mức tiêu hao và hao hụt theo từng lệnh sản xuất."],
        },
        {
          heading: "Khó kiểm soát chất lượng và truy xuất thành phẩm",
          paragraphs: ["Kết quả kiểm tra chất lượng được lưu tại nhiều bộ phận, gây khó khăn khi cần xác định lô nguyên liệu, công đoạn xử lý hoặc lô thành phẩm có liên quan đến một vấn đề chất lượng."],
        },
      ],
    },
    {
      id: "giai-phap-tnm-erp",
      heading: "2. Giải pháp TNT đề xuất: ERP phù hợp với quy trình chế biến thủy sản",
      paragraphs: ["Thay vì xây dựng một hệ thống hoàn toàn mới, TNT lựa chọn các phân hệ cốt lõi của TNM làm nền tảng, sau đó xác định những điểm cần cấu hình hoặc tùy chỉnh để đáp ứng nghiệp vụ thực tế."],
      subsections: [
        {
          heading: "Quản lý nguyên liệu và tồn kho theo lô",
          bullets: [
            "Ghi nhận thông tin lô nguyên liệu, nhà cung cấp, ngày nhập và khối lượng.",
            "Theo dõi nhập, xuất và tồn kho theo từng lô.",
            "Hỗ trợ quản lý hạn sử dụng và nguyên tắc xuất kho phù hợp với đặc điểm nguyên liệu.",
          ],
        },
        {
          heading: "Liên kết kế hoạch và thực tế sản xuất",
          bullets: [
            "Tạo lệnh sản xuất dựa trên nhu cầu đơn hàng.",
            "Ghi nhận nguyên liệu đầu vào, sản lượng đầu ra và hao hụt theo công đoạn.",
            "Liên kết thông tin từ lô nguyên liệu đến lô thành phẩm.",
          ],
        },
        {
          heading: "Kiểm soát chất lượng và truy xuất nguồn gốc",
          bullets: [
            "Ghi nhận kết quả kiểm tra chất lượng theo từng lô.",
            "Theo dõi trạng thái đạt, chờ kiểm tra hoặc không đạt.",
            "Hỗ trợ tra cứu mối liên hệ giữa nguyên liệu, lệnh sản xuất và thành phẩm.",
          ],
        },
        {
          heading: "Điểm khác biệt trong cách tiếp cận của TNT",
          paragraphs: [
            "Các nghiệp vụ phổ biến như mua hàng, quản lý kho, lệnh sản xuất và bán hàng được ưu tiên triển khai trên nền tảng TNM hiện có.",
            "Những yêu cầu đặc thù như theo dõi hao hụt sau sơ chế, cấu trúc mã lô hay tiêu chí kiểm tra chất lượng được đánh giá riêng để quyết định mức độ cấu hình hoặc tùy chỉnh cần thiết.",
            "Cách tiếp cận này hướng đến một giải pháp vừa phù hợp quy trình thực tế, vừa duy trì phạm vi triển khai và chi phí ở mức có thể kiểm soát.",
          ],
        },
      ],
    },
    {
      id: "gia-tri-ky-vong",
      heading: "3. Giá trị kỳ vọng đối với doanh nghiệp",
      bullets: [
        "Minh bạch dữ liệu theo từng lô: Thông tin về nguyên liệu, sản xuất và thành phẩm được liên kết, hỗ trợ truy xuất khi phát sinh yêu cầu kiểm tra.",
        "Kiểm soát hao hụt tốt hơn: Doanh nghiệp có cơ sở đối chiếu khối lượng nguyên liệu sử dụng với sản lượng thực tế để nhận diện chênh lệch.",
        "Giảm thao tác tổng hợp thủ công: Các bộ phận cùng sử dụng dữ liệu trên một hệ thống, hạn chế việc nhập liệu lặp lại và đối chiếu nhiều bảng tính.",
        "Tăng khả năng chủ động trong điều hành: Nhà quản lý có thể theo dõi tình hình kho, tiến độ sản xuất và trạng thái chất lượng để đưa ra quyết định dựa trên dữ liệu.",
      ],
    },
    {
      id: "dong-hanh-trien-khai",
      heading: "4. Đồng hành từ nghiệp vụ đến vận hành",
      paragraphs: [
        "Với TNT, một giải pháp ERP phù hợp không chỉ cần đáp ứng yêu cầu về tính năng mà còn phải phù hợp với cách doanh nghiệp thực sự vận hành.",
        "Vì vậy, TNT chú trọng khảo sát quy trình, thống nhất phạm vi triển khai, hướng dẫn người sử dụng và hỗ trợ doanh nghiệp trong quá trình đưa hệ thống vào hoạt động.",
      ],
    },
  ],
  quote: "Giải pháp phù hợp bắt đầu từ việc hiểu đúng nghiệp vụ — và chỉ tùy chỉnh khi thực sự cần thiết.",
  editorialNote: "Ghi chú biên tập: Khi xuất bản dự án thực tế, bổ sung tên khách hàng được phép công bố, phạm vi nghiệm thu và số liệu đo lường trước/sau. Không sử dụng tình huống mô phỏng này như một thành tích đã được xác thực.",
  contact: {
    title: "Doanh nghiệp của bạn đang gặp những bài toán tương tự?",
    description: "TNT sẵn sàng cùng doanh nghiệp rà soát quy trình, xác định những điểm cần kết nối và tư vấn phạm vi triển khai ERP phù hợp với đặc thù sản xuất.",
    invitation: "Liên hệ TNT để trao đổi về giải pháp ERP cho doanh nghiệp chế biến thực phẩm.",
  },
};
