import type { ArticleRecord, ProjectRecord } from "@/content/models";

// Editorial source: the nine TNT publications selected in the owner's migration brief.
// Keep source URLs here for provenance, without displaying internal editorial notes.
export const migratedEnglish: Record<string, string> = {};
function copy(vi: string, en: string) {
  migratedEnglish[vi.replace(/\s+/g, ' ').trim()] = en;
  return vi;
}

copy("Giáo dục", "Education");
copy(" Tầng 4, tòa nhà LeBuilding, 342 Mỹ Đình, phường Từ Liêm, Hà Nội", " 4th floor, LeBuilding, 342 My Dinh, Tu Liem Ward, Hanoi");
copy("Sáu giai đoạn triển khai phần mềm theo nhu cầu doanh nghiệp.", "Six stages of software delivery tailored to business needs.");
copy("Đội ngũ TNT phối hợp từ phân tích nghiệp vụ đến phát triển Frontend, Backend, Mobile, tích hợp dữ liệu và kiểm thử phần mềm.", "TNT teams work across business analysis, frontend, backend, mobile, data integration and software testing.");
copy("Tìm hiểu các hệ thống TNT đã xây dựng cho giáo dục và hỗ trợ doanh nghiệp.", "Explore systems TNT has built for education and business support.");
copy("Sản xuất · TNM ERP", "Manufacturing · TNM ERP");

export const migratedProjects: readonly ProjectRecord[] = [
  {
    slug: "kala",
    shortTitle: "KALA",
    title: copy("Giải pháp quản lý sản xuất cho nhà máy kính KALA", "Production management for the KALA glass factory"),
    detailTitle: copy("Triển khai TNM cho nhà máy kính KALA", "Implementing TNM at the KALA glass factory"),
    summary: copy("TNT triển khai TNM cho KALA, kết nối quản lý sản xuất, đơn hàng và khách hàng; theo dõi tiến độ qua từng công đoạn gia công kính.", "TNT implemented TNM for KALA, connecting production, order and customer management and tracking progress through each glass processing stage."),
    topic: "ERP", industry: "Sản xuất", service: "ERP", client: "KALA",
    scope: copy("Sản xuất, đơn hàng và khách hàng", "Production, orders and customers"),
    challengeTitle: copy("Theo dõi chuỗi công đoạn gia công kính", "Tracking the glass processing workflow"),
    challenge: copy("KALA sản xuất và gia công kính cường lực với chuỗi công đoạn cắt, mài, khoan, tôi, dán và hộp. Việc quản lý sản xuất cần bám sát từng công đoạn, đồng thời gắn với đơn hàng và thông tin khách hàng để đội ngũ quản lý nắm bắt tiến độ tại nhà máy.", "KALA manufactures and processes tempered glass through cutting, grinding, drilling, tempering, laminating and insulating glass assembly. Production management needs to follow each stage and connect it to orders and customer information so managers can track factory progress."),
    solutionTitle: copy("Kết nối nghiệp vụ trên nền tảng TNM", "Connecting operations on TNM"),
    solution: copy("Tháng 8/2020, các kỹ sư Trí Nghĩa khảo sát nghiệp vụ và triển khai phần mềm quản trị doanh nghiệp TNM tại KALA. Phạm vi gồm quản lý sản xuất, quản lý đơn hàng và quản lý khách hàng. Hệ thống hỗ trợ tự động hóa việc cập nhật tiến độ và kết quả sản xuất theo đặc thù gia công kính.", "In August 2020, Tri Nghia engineers surveyed KALA's operations and implemented the TNM enterprise management platform. The scope covered production, order and customer management, with automated progress and output updates tailored to glass processing."),
    approach: copy("Khảo sát nghiệp vụ gia công kính và triển khai các phân hệ TNM phù hợp với quy trình nhà máy.", "Survey glass processing operations and implement TNM modules suited to the factory workflow."),
    outcome: copy("KALA có công cụ theo dõi hoạt động sản xuất trên một hệ thống, giúp cán bộ quản lý nắm bắt tình hình nhà máy nhanh hơn. Dữ liệu tiến độ và kết quả từng công đoạn hỗ trợ kiểm soát chất lượng và điều phối thực hiện đơn hàng.", "KALA gained a system for monitoring production activities and giving managers a faster view of factory operations. Stage-level progress and output data support quality control and order coordination."),
    image: "/images/legacy/198-0.webp",
    imageAlt: copy("Hình ảnh nhà máy kính KALA", "The KALA glass factory"),
    status: "approved",
    sourceUrl: "https://tringhiatech.vn/vi/tri-nghia-trien-khai-giai-phap-quan-tri-tnm-cho-nha-may-kinh-kala-n198",
    gallery: [{ src: "/images/legacy/198-0.webp", alt: "Hình ảnh nhà máy kính KALA", width: 1280, height: 962 }],
    relatedProjectSlugs: ["kova", "erp-che-bien-thuy-san"],
  },
  {
    slug: "kova", shortTitle: "KOVA",
    title: copy("Hệ thống quản lý bán hàng và pha màu sơn KOVA", "Sales and paint tinting management for KOVA"),
    summary: copy("Nền tảng TNM kết nối đơn hàng, đại lý, chi nhánh và bộ phận pha màu, hỗ trợ KOVA số hóa hoạt động bán hàng và theo dõi xử lý đơn.", "TNM connects orders, dealers, branches and paint tinting teams, helping KOVA digitize sales operations and track order processing."),
    topic: "ERP", industry: "Sản xuất", service: "ERP", client: "KOVA",
    scope: copy("Bán hàng, đơn hàng và pha màu sơn", "Sales, orders and paint tinting"),
    challengeTitle: copy("Kết nối bán hàng với nghiệp vụ pha màu", "Connecting sales with paint tinting"),
    challenge: copy("Nhà máy sơn KOVA cần phối hợp hoạt động giữa đại lý, chi nhánh, bộ phận bán hàng và bộ phận pha màu. Thông tin đặt hàng và trạng thái xử lý cần được trao đổi xuyên suốt để các nhóm cùng theo dõi đơn và tổ chức công việc.", "KOVA needed to coordinate dealers, branches, sales staff and paint tinting teams. Order information and processing status had to flow across these groups so they could track orders and organize work."),
    solutionTitle: copy("Phát triển hệ thống bán hàng và pha màu trên TNM", "Building sales and tinting management on TNM"),
    solution: copy("Trí Nghĩa trực tiếp khảo sát nghiệp vụ tại KOVA và xây dựng hệ thống dựa trên nền tảng quản trị doanh nghiệp TNM. Giải pháp số hóa đặt hàng, theo dõi đơn hàng và hoạt động pha màu; bổ sung kênh đặt hàng trực tuyến, tin nhắn SMS và tra cứu trạng thái đơn để kết nối bộ phận bán hàng với đại lý.", "Tri Nghia surveyed KOVA's operations and developed a system on the TNM enterprise management platform. It digitizes ordering, order tracking and paint tinting, with online ordering, SMS messages and order status tracking to connect sales staff with dealers."),
    approach: copy("Khảo sát trực tiếp và phát triển phần mềm theo nghiệp vụ bán hàng, pha màu của KOVA.", "Survey operations on site and develop software around KOVA's sales and tinting workflows."),
    outcome: copy("KOVA chính thức đưa hệ thống vào vận hành trong tháng 3/2020. Việc đặt hàng và theo dõi xử lý đơn được thực hiện trên cùng nền tảng, hỗ trợ tương tác với đại lý, giảm công việc thủ công và tăng khả năng giám sát hoạt động bán hàng.", "KOVA put the system into operation in March 2020. Ordering and order tracking share one platform, supporting dealer communication, reducing manual work and improving sales supervision."),
    image: "/images/legacy/192-0.webp",
    imageAlt: copy("Biểu trưng KOVA trong tư liệu dự án TNT", "KOVA logo in TNT project materials"),
    status: "approved",
    sourceUrl: "https://tringhiatech.vn/vi/tri-nghia-trien-khai-he-thong-quan-ly-ban-hang-cho-nha-may-son-kova-n192",
    gallery: [{ src: "/images/legacy/192-0.webp", alt: "Biểu trưng KOVA trong tư liệu dự án TNT", width: 742, height: 436 }],
    relatedProjectSlugs: ["kala", "cybertnm-thanh-hoa"],
  },
  {
    slug: "lomonoxop-my-dinh", shortTitle: "TN EDU",
    title: copy("Chuyển đổi số hệ thống giáo dục Lomonoxop Mỹ Đình", "Digital transformation at Lomonoxop My Dinh schools"),
    summary: copy("TN EDU kết nối dữ liệu quản lý nhà trường trên Web và Mobile, tạo kênh trao đổi giữa giáo viên, phụ huynh và nhà trường.", "TN EDU connects school management data on web and mobile, providing a communication channel for teachers, parents and the school."),
    topic: "Outsourcing", industry: "Giáo dục", service: copy("Phần mềm theo yêu cầu / TN EDU", "Custom software / TN EDU"),
    client: copy("Hệ thống giáo dục Lomonoxop Mỹ Đình", "Lomonoxop My Dinh school system"),
    scope: copy("Quản trị trường học trên Web và Mobile", "School management on web and mobile"),
    challengeTitle: copy("Số hóa quản lý và kết nối gia đình với nhà trường", "Digitizing management and connecting families with school"),
    challenge: copy("Lomonoxop Mỹ Đình triển khai chuyển đổi số cho hoạt động quản lý từ tiểu học đến trung học phổ thông. Nhà trường cần tổ chức dữ liệu và quy trình hằng ngày trên một hệ thống, đồng thời giúp phụ huynh theo dõi việc học tập, rèn luyện và các hoạt động của học sinh.", "Lomonoxop My Dinh undertook digital transformation of management from primary through upper secondary school. It needed a shared system for data and daily workflows, while enabling parents to follow students' learning, development and activities."),
    solutionTitle: copy("Triển khai TN EDU trên Web và ứng dụng di động", "Implementing TN EDU on web and mobile"),
    solution: copy("TNT ký hợp đồng trong quý I/2023, sau đó tư vấn, xây dựng và triển khai TN EDU cho nhà trường. Hệ thống kết nối dữ liệu và tương tác trên Web, Mobile App. Ứng dụng phụ huynh cung cấp kết quả học tập, hoạt động câu lạc bộ, thông tin xe tuyến, thực đơn, học phí, xin nghỉ phép, tin tức và trao đổi với giáo viên hoặc ban giám hiệu.", "TNT signed the contract in the first quarter of 2023, then advised, built and implemented TN EDU. The system connects data and communication on web and mobile. The parent app provides learning results, club activities, school bus information, menus, fees, absence requests, news and communication with teachers or school leaders."),
    approach: copy("Tư vấn và triển khai hệ thống quản lý trường học kết hợp ứng dụng dành cho phụ huynh.", "Advise and implement a school management system with a dedicated parent app."),
    outcome: copy("TNT và Lomonoxop Mỹ Đình nghiệm thu dự án ngày 06/06/2023. Dữ liệu học tập và sinh hoạt được cập nhật bởi giáo viên, nhân viên nhà trường; phụ huynh có kênh theo dõi thông tin và trao đổi với nhà trường ngay trên ứng dụng.", "TNT and Lomonoxop My Dinh completed project acceptance on 6 June 2023. Teachers and school staff update learning and daily activity data, while parents follow information and communicate with the school through the app."),
    image: "/images/legacy/232-0.webp",
    imageAlt: copy("TNT và Lomonoxop Mỹ Đình trong buổi nghiệm thu dự án TN EDU năm 2023", "TNT and Lomonoxop My Dinh at the 2023 TN EDU project acceptance meeting"),
    status: "approved",
    sourceUrl: "https://tringhiatech.vn/vi/tri-nghia-thuc-hien-chuyen-doi-so-cho-he-thong-giao-duc-lomonoxop-my-dinh-n232",
    gallery: [{ src: "/images/legacy/232-0.webp", alt: "TNT và Lomonoxop Mỹ Đình trong buổi nghiệm thu dự án TN EDU năm 2023", width: 1600, height: 900 }],
    relatedProjectSlugs: ["cong-thong-tin-doanh-nghiep-ha-noi", "cybertnm-thanh-hoa"],
  },
  {
    slug: "cybertnm-thanh-hoa", shortTitle: "CyberTNM",
    title: copy("Quản lý bán điện CyberTNM tại Thanh Hóa", "CyberTNM electricity sales management in Thanh Hoa"),
    summary: copy("CyberTNM liên kết khách hàng, ghi chỉ số, thu tiền và hóa đơn điện tử, phục vụ nghiệp vụ quản lý bán điện của các hợp tác xã tại Thanh Hóa.", "CyberTNM connects customers, meter readings, payment collection and electronic invoicing for electricity cooperatives in Thanh Hoa."),
    topic: "ERP", industry: copy("Tiện ích / Năng lượng", "Utilities / Energy"),
    service: copy("Phần mềm chuyên ngành / CyberTNM", "Industry software / CyberTNM"),
    client: copy("Các hợp tác xã bán điện tại Thanh Hóa", "Electricity sales cooperatives in Thanh Hoa"),
    scope: copy("Khách hàng, chỉ số điện và hóa đơn điện tử", "Customers, meter readings and electronic invoices"),
    challengeTitle: copy("Liên thông nghiệp vụ từ ghi chỉ số đến thu tiền điện", "Connecting meter readings with payment collection"),
    challenge: copy("Các hợp tác xã bán điện cần quản lý khách hàng, chốt số điện sử dụng, thu tiền và lập hóa đơn. Dữ liệu công tơ, lịch sử sử dụng và tình hình tiêu thụ theo khu vực, trạm điện cũng cần được tổng hợp để phục vụ cán bộ quản lý.", "Electricity cooperatives need to manage customers, record consumption, collect payments and issue invoices. Meter data, consumption history and usage by area or substation also need to be available for management."),
    solutionTitle: copy("Kết hợp TNM, ứng dụng di động và CyberBill", "Combining TNM, mobile applications and CyberBill"),
    solution: copy("Tháng 3/2020, Trí Nghĩa triển khai giải pháp kết hợp quản lý khách hàng, đơn hàng và ứng dụng di động TNM với hệ thống ký, xuất hóa đơn điện tử CyberBill. Nhân viên có thể chốt chỉ số trên máy tính hoặc máy POS cầm tay, in biên lai khi thu tiền và thực hiện ký, xuất hóa đơn điện tử. Mã tra cứu trên biên lai giúp người sử dụng điện tìm lại hóa đơn.", "In March 2020, Tri Nghia implemented a solution combining TNM customer and order management and mobile applications with CyberBill electronic invoice signing and issuance. Staff can record readings on a computer or handheld POS, print a receipt when collecting payment and sign and issue an electronic invoice. A lookup code on the receipt lets customers retrieve their invoice."),
    approach: copy("Kết nối nghiệp vụ quản lý điện và hệ thống hóa đơn điện tử trong một quy trình.", "Connect electricity management and electronic invoicing in one workflow."),
    outcome: copy("CyberTNM hỗ trợ theo dõi lịch sử dùng điện, cập nhật thay đổi công tơ, bảng giá điện bậc thang và thống kê theo khu vực, trạm điện. Quy trình ghi chỉ số, thu tiền và xuất hóa đơn được liên kết, giúp giảm thao tác thủ công và hỗ trợ quản lý hoạt động bán điện tập trung.", "CyberTNM supports consumption history, meter changes, tiered tariff updates and reporting by area or substation. Connected readings, collection and invoicing reduce manual work and support centralized electricity sales management."),
    image: "/images/legacy/197-0.webp",
    imageAlt: copy("Thiết bị POS và hóa đơn trong dự án CyberTNM Thanh Hóa", "POS device and invoice in the CyberTNM Thanh Hoa project"),
    status: "approved",
    sourceUrl: "https://tringhiatech.vn/vi/trien-khai-phan-mem-quan-ly-ban-dien-cybertnm-tai-thanh-hoa-n197",
    gallery: [
      { src: "/images/legacy/197-0.webp", alt: "Thiết bị POS và hóa đơn trong dự án CyberTNM Thanh Hóa", width: 1600, height: 1200 },
      { src: "/images/legacy/197-1.webp", alt: copy("Giao diện thu tiền điện trên CyberTNM", "Electricity payment collection interface in CyberTNM"), width: 675, height: 1200 },
    ],
    relatedProjectSlugs: ["kova", "cong-thong-tin-doanh-nghiep-ha-noi"],
  },
  {
    slug: "cong-thong-tin-doanh-nghiep-ha-noi", shortTitle: copy("Hà Nội", "Hanoi"),
    title: copy("Cổng thông tin hỗ trợ doanh nghiệp Hà Nội", "Hanoi business support portal"),
    summary: copy("TNT thiết kế và xây dựng cổng thông tin cho Trung tâm Hỗ trợ doanh nghiệp nhỏ và vừa Hà Nội, kết nối doanh nghiệp với thông tin và các chương trình hỗ trợ.", "TNT designed and built a portal for the Hanoi SME Support Center, connecting businesses with information and support programs."),
    topic: "Outsourcing", industry: copy("Dịch vụ công / Hỗ trợ doanh nghiệp", "Public services / Business support"),
    service: "Outsourcing",
    client: copy("Trung tâm Hỗ trợ doanh nghiệp nhỏ và vừa Hà Nội", "Hanoi SME Support Center"),
    scope: copy("Thiết kế và xây dựng cổng thông tin", "Portal design and development"),
    challengeTitle: copy("Tạo kênh tiếp cận các chương trình hỗ trợ", "Providing access to business support programs"),
    challenge: copy("Doanh nghiệp trên địa bàn Hà Nội cần một kênh tìm hiểu thông tin hỗ trợ từ thành phố, các chương trình đào tạo, khởi nghiệp sáng tạo và tư vấn chuyên gia. Trung tâm Hỗ trợ doanh nghiệp nhỏ và vừa Hà Nội cần cổng thông tin để đưa những nội dung này đến doanh nghiệp.", "Hanoi businesses need access to city support information, training programs, innovative entrepreneurship initiatives and expert advice. The Hanoi SME Support Center needed a portal to make this information available to businesses."),
    solutionTitle: copy("Phát triển cổng thông tin theo nhu cầu của tổ chức", "Developing a portal around the organization's needs"),
    solution: copy("Trí Nghĩa thiết kế và xây dựng cổng thông tin hỗ trợ doanh nghiệp cho Trung tâm. Các nội dung được giới thiệu gồm thông tin hỗ trợ, khóa đào tạo có hỗ trợ kinh phí từ thành phố, chương trình khởi nghiệp sáng tạo và mạng lưới chuyên gia tư vấn thuộc nhiều lĩnh vực.", "Tri Nghia designed and built the Center's business support portal. Its content includes support information, city-subsidized training, innovative entrepreneurship programs and a network of consultants across multiple disciplines."),
    approach: copy("Thiết kế và xây dựng website phục vụ việc cung cấp thông tin và kết nối doanh nghiệp.", "Design and develop a website for information access and business connections."),
    outcome: copy("Cổng thông tin được Trung tâm đưa vào vận hành và được TNT giới thiệu trong tháng 3/2020. Hệ thống tạo thêm một kênh để doanh nghiệp tiếp cận thông tin, tìm hiểu chương trình hỗ trợ và kết nối với hoạt động tư vấn, đào tạo của thành phố.", "The Center put the portal into operation, and TNT introduced it in March 2020. It provides an additional channel for businesses to access information, explore support programs and connect with the city's consulting and training activities."),
    image: "/images/legacy/195-0.webp",
    imageAlt: copy("Giao diện cổng thông tin hỗ trợ doanh nghiệp Hà Nội do TNT xây dựng", "Interface of the Hanoi business support portal built by TNT"),
    status: "approved",
    sourceUrl: "https://tringhiatech.vn/vi/tri-nghia-trien-khai-cong-thong-tin-ho-tro-doanh-nghiep-cho-ha-noi-n195",
    gallery: [
      { src: "/images/legacy/195-0.webp", alt: "Giao diện cổng thông tin hỗ trợ doanh nghiệp Hà Nội do TNT xây dựng", width: 1366, height: 768 },
      { src: "/images/legacy/195-1.webp", alt: copy("Nội dung trên cổng thông tin hỗ trợ doanh nghiệp Hà Nội", "Content on the Hanoi business support portal"), width: 1357, height: 623 },
    ],
    relatedProjectSlugs: ["lomonoxop-my-dinh", "cybertnm-thanh-hoa"],
  },
];

export const migratedArticles: readonly ArticleRecord[] = [
  {
    slug: "chuyen-doi-so-nha-may-co-khi",
    title: copy("Chuyển đổi số nhà máy cơ khí: khi dữ liệu trở thành năng lực cạnh tranh", "Digital transformation in mechanical manufacturing: data as a competitive capability"),
    summary: copy("Từ định mức vật tư, công đoạn gia công đến chất lượng và giao hàng: kết nối dữ liệu để nhà máy cơ khí kiểm soát tiến độ và chi phí sát thực tế.", "From bills of materials and machining stages to quality and delivery: connect data to give mechanical manufacturers a clearer view of schedules and costs."),
    topic: "Sản xuất", status: "approved", author: "TNT / Trí Nghĩa Tech",
    publishedAt: "2026-04-07", dateLabel: "07/04/2026", readingTime: "5 phút đọc",
    image: "/images/legacy/263-0.webp",
    imageAlt: copy("Chuyển đổi số và quản trị sản xuất trong nhà máy cơ khí", "Digital transformation and production management in mechanical manufacturing"),
    sourceUrl: "https://tringhiatech.vn/vi/chuyen-doi-so-cho-nha-may-sx-co-khi-khi-du-lieu-tro-thanh-nang-luc-canh-tranh-n263",
    relatedArticleSlugs: ["van-hanh-nha-may", "quan-ly-kho-logistics", "quan-tri-hop-nhat-sme-thuong-mai"],
    relatedProjectSlugs: ["kala", "kova"],
    relatedServiceHref: "/dich-vu/erp", relatedServiceLabel: "Tìm hiểu ERP",
    sections: [
      {
        heading: copy("Điểm nghẽn từ đơn hàng đến xưởng sản xuất", "Bottlenecks between orders and the factory floor"),
        paragraphs: [
          copy("Nhà máy cơ khí thường theo dõi đơn hàng, vật tư, kho và sản xuất bằng nhiều công cụ. Khi dữ liệu chưa liên thông, kinh doanh khó chuyển đầy đủ yêu cầu sang kế hoạch; phân xưởng khó đối chiếu tiến độ với vật tư và lịch giao hàng. Bộ phận chất lượng lại mất thời gian tìm công đoạn và lệnh sản xuất liên quan đến sản phẩm lỗi.", "Mechanical manufacturers often track orders, materials, inventory and production in separate tools. Without connected data, sales teams struggle to pass requirements to planners, workshops cannot easily compare progress against material availability and delivery dates, and quality teams spend time finding the operations and production orders behind defective items."),
          copy("Bài toán chuyển đổi số vì thế cần bắt đầu từ dòng chảy của một đơn hàng: nhận yêu cầu, xác định vật tư, lập kế hoạch, thực hiện gia công, kiểm tra chất lượng và giao hàng. Mỗi điểm cập nhật cần có người chịu trách nhiệm và trạng thái rõ ràng.", "Digital transformation should start with the flow of an order: receive requirements, identify materials, plan production, perform machining, inspect quality and deliver. Each update needs a responsible person and a clear status."),
        ],
      },
      {
        heading: copy("Quản lý BOM theo đặc thù gia công", "Managing BOMs for machining operations"),
        image: { src: "/images/legacy/263-1.webp", alt: copy("Kế hoạch sản xuất tổng trên TNM", "Master production planning in TNM"), width: 1600, height: 1193 },
        paragraphs: [
          copy("Cùng một mã thành phẩm có thể thay đổi quy trình công nghệ hoặc định mức theo giai đoạn. Nhà máy cần quản lý định mức nguyên vật liệu và quy trình sản xuất (BOM) gắn với thời gian hiệu lực, công đoạn, bộ phận phụ trách, nhân công và thiết bị sử dụng.", "A finished product may require different processes or material quantities over time. The factory needs bills of materials and production routings linked to effective dates, operations, responsible departments, labor and equipment."),
          copy("Trong hướng tiếp cận TNM, dữ liệu thành phẩm, bán thành phẩm và nguyên vật liệu được tổ chức cùng quy trình. Khi lập kế hoạch, doanh nghiệp có cơ sở đối chiếu nhu cầu vật tư và năng lực thực hiện thay vì chỉ căn cứ vào số lượng đơn hàng.", "TNM organizes finished goods, semi-finished goods and raw materials alongside their workflows. This gives planners a basis for comparing material requirements with production capacity, beyond order quantities alone."),
        ],
      },
      {
        heading: copy("Kết nối kế hoạch tổng với lệnh sản xuất hằng ngày", "Connecting the master plan with daily production orders"),
        paragraphs: [
          copy("Kế hoạch tổng cần phản ánh nhiều đơn hàng, mức độ ưu tiên và thời hạn giao. Lệnh sản xuất hằng ngày là nơi ghi nhận sản lượng, thời gian thực hiện, nhân công, thiết bị và vật tư tiêu hao. Kết nối hai lớp này giúp quản lý phân xưởng nhận biết chênh lệch giữa kế hoạch và thực tế.", "The master plan needs to reflect multiple orders, priorities and delivery deadlines. Daily production orders record output, time, labor, equipment and consumed materials. Connecting these levels helps workshop managers identify differences between plan and execution."),
          copy("Dữ liệu thực hiện cũng là đầu vào cho việc tính chi phí và đánh giá từng đơn hàng. Khi xuất hiện nguy cơ chậm giao, đội ngũ điều hành có thông tin để xem xét phân bổ lại nguồn lực hoặc điều chỉnh lịch sản xuất.", "Execution data also informs costing and order assessment. When a delivery is at risk, managers have information to consider reallocating resources or adjusting the production schedule."),
        ],
      },
      {
        heading: copy("Liên kết chất lượng, vật tư và kho", "Connecting quality, materials and inventory"),
        paragraphs: [
          copy("Lỗi chất lượng cần gắn với công đoạn, người thực hiện và lệnh sản xuất. Việc ghi nhận phương án sửa chữa, sản xuất bù hoặc xử lý hàng lỗi giúp nhà máy theo dõi tác động đến vật tư và tiến độ giao hàng.", "Quality issues need to be linked to operations, operators and production orders. Recording repair, replacement production or defective stock handling helps the factory track effects on materials and delivery."),
          copy("Ở kho, cần theo dõi vật tư đưa vào sản xuất, vật tư trả lại, bán thành phẩm, thành phẩm và hàng chờ gia công. Các báo cáo tồn lâu ngày, tồn tối thiểu, thành phẩm chưa xuất cùng quy trình kiểm kê giúp đối chiếu dữ liệu với thực tế tại xưởng.", "Inventory tracking should cover materials issued to production, returns, work in progress, finished goods and items awaiting subcontracting. Aging stock, minimum stock and unshipped finished goods reports, together with stocktaking, help reconcile data with the factory floor."),
        ],
      },
      {
        heading: copy("Xây dựng góc nhìn điều hành theo đơn hàng", "Building an order-level management view"),
        image: { src: "/images/legacy/263-2.webp", alt: copy("Dashboard theo dõi đơn hàng và sản xuất trên TNM", "Order and production monitoring dashboard in TNM"), width: 1107, height: 1200 },
        paragraphs: [
          copy("Khi báo giá, đơn hàng, mua hàng, sản xuất, chất lượng và kho được kết nối, lãnh đạo có thể theo dõi một chuỗi thông tin thống nhất. Các chỉ số nên bám vào quyết định cần đưa ra: tiến độ giao, mức đáp ứng vật tư, lỗi chất lượng và chi phí thực hiện.", "Connecting quotations, orders, purchasing, production, quality and inventory gives leaders one consistent information chain. Indicators should support actual decisions: delivery progress, material availability, quality issues and execution costs."),
          copy("Doanh nghiệp nên lựa chọn một nhóm sản phẩm hoặc quy trình ưu tiên để chuẩn hóa dữ liệu trước khi mở rộng. Báo cáo điều hành và các ứng dụng AI có ý nghĩa hơn khi được xây dựng trên dữ liệu vận hành đầy đủ, nhất quán.", "Manufacturers should select a product group or priority workflow and standardize its data before expanding. Management reporting and AI applications become more useful when based on complete, consistent operational data."),
        ],
      },
    ],
  },
  {
    slug: "quan-ly-kho-logistics",
    title: copy("Quản lý kho thông minh: bài toán vận hành của doanh nghiệp logistics", "Smart warehouse management: operational challenges for logistics businesses"),
    summary: copy("Kho logistics cần kết nối dòng hàng, vị trí lưu trữ, điều xe và dữ liệu đối tác. Tìm hiểu cách tổ chức một quy trình xuyên suốt từ yêu cầu giao nhận đến đối soát.", "Logistics warehouses need connected stock flows, storage locations, vehicle dispatch and partner data. Explore a workflow from handling requests to reconciliation."),
    topic: "ERP", status: "approved", author: "TNT / Trí Nghĩa Tech",
    publishedAt: "2026-02-03", dateLabel: "03/02/2026", readingTime: "5 phút đọc",
    image: "/images/legacy/264-0.webp",
    imageAlt: copy("Quản lý kho thông minh cho doanh nghiệp logistics", "Smart warehouse management for logistics businesses"),
    sourceUrl: "https://tringhiatech.vn/vi/quan-ly-kho-thong-minh-bai-toan-song-con-cua-doanh-nghiep-logistics-n264",
    relatedArticleSlugs: ["quan-ly-kho", "chuyen-doi-so-nha-may-co-khi", "quan-tri-hop-nhat-sme-thuong-mai"],
    relatedServiceHref: "/dich-vu/erp#erp-kho", relatedServiceLabel: copy("Khám phá phân hệ Kho / WMS", "Explore Inventory / WMS"),
    sections: [
      {
        heading: copy("Kho logistics là điểm kết nối nhiều bên", "Logistics warehouses connect multiple parties"),
        paragraphs: [
          copy("Với đơn vị kinh doanh dịch vụ kho bãi, một lô hàng liên quan đến khách hàng, bộ phận kho, vận tải và kế toán. Mỗi khách hàng có thể có mã hàng, yêu cầu giao nhận và cách đối soát riêng. Chỉ theo dõi tổng số lượng tồn chưa đủ để trả lời hàng đang ở đâu, thuộc yêu cầu nào và khi nào cần giao.", "For warehouse service providers, one shipment involves customers, warehouse staff, transport and accounting. Customers may use different product codes, handling requirements and reconciliation rules. A stock total alone cannot explain where goods are, which request they belong to or when they must ship."),
          copy("Doanh nghiệp cần quản lý vị trí, tuổi kho, lịch sử nhập xuất, trạng thái lô hàng và tiến độ giao nhận trong cùng dòng thông tin. Khi các bộ phận sử dụng dữ liệu khác nhau, việc điều phối dễ phát sinh chậm trễ và sai lệch.", "Businesses need storage locations, stock age, movement history, shipment status and handling progress in one information flow. Different data across departments makes coordination prone to delays and discrepancies."),
        ],
      },
      {
        heading: copy("Từ yêu cầu khách hàng đến phiếu nhập xuất", "From customer requests to warehouse transactions"),
        image: { src: "/images/legacy/264-1.webp", alt: copy("Thông tin quản lý kho trên TNM WMS", "Warehouse management information in TNM WMS"), width: 1168, height: 595 },
        paragraphs: [
          copy("Quy trình nên bắt đầu từ thông tin khách hàng, hàng hóa và yêu cầu dịch vụ. Phiếu nhập, phiếu xuất cần gắn với đúng yêu cầu để bộ phận kho kiểm tra, xác nhận thực hiện và cập nhật tồn kho theo giao dịch.", "The workflow should begin with customer, product and service request information. Receipts and dispatch records should link to the right request so warehouse staff can check, confirm execution and update stock with each transaction."),
          copy("Trong hướng tiếp cận TNM WMS, dữ liệu kho gồm thông tin kho, khu vực, kệ và vị trí lưu trữ. Việc xem tồn theo tuổi kho và chi phí lưu kho hỗ trợ đánh giá khả năng quay vòng, sử dụng diện tích và tổ chức giao nhận.", "TNM WMS organizes warehouse, zone, shelf and storage location data. Viewing stock age and storage costs supports assessment of turnover, space use and handling arrangements."),
        ],
      },
      {
        heading: copy("Điều xe gắn với kế hoạch xuất hàng", "Linking vehicle dispatch with outbound plans"),
        image: { src: "/images/legacy/264-2.webp", alt: copy("Giao diện nghiệp vụ kho và giao nhận trên TNM", "Warehouse and handling workflow interface in TNM"), width: 1072, height: 518 },
        paragraphs: [
          copy("Nếu kế hoạch xuất kho và điều xe nằm trên hai công cụ độc lập, người điều phối khó biết lô nào sẵn sàng và xe nào có thể đáp ứng. Liên kết đề xuất điều động với phiếu xuất giúp giảm việc nhập lại thông tin và hỗ trợ sắp xếp lịch giao hàng.", "When outbound plans and vehicle dispatch use separate tools, coordinators struggle to see which shipment is ready and which vehicle is available. Linking dispatch requests to outbound records reduces repeated data entry and supports delivery scheduling."),
          copy("Thông tin cần theo dõi gồm xe của doanh nghiệp, xe thuê, lịch điều động và công việc của tài xế. Nhờ đó, bộ phận kho và vận tải có cơ sở cùng cập nhật tiến độ thay vì đối chiếu bằng các cuộc trao đổi rời rạc.", "Useful records include owned and hired vehicles, dispatch schedules and driver tasks. Warehouse and transport teams can then update progress together instead of reconciling fragmented conversations."),
        ],
      },
      {
        heading: copy("Làm rõ phạm vi tích hợp và nghiệp vụ kho ngoại quan", "Defining integrations and bonded warehouse operations"),
        paragraphs: [
          copy("Kho phục vụ nhiều đối tác cần thống nhất cách nhận lệnh và phản hồi trạng thái. Kết nối qua API hoặc FTP cần làm rõ cấu trúc dữ liệu, tần suất đồng bộ và cách xử lý lỗi; không chỉ dừng ở việc có một cổng kết nối.", "Warehouses serving multiple partners need agreed methods for receiving instructions and returning status updates. API or FTP integrations require defined data structures, synchronization frequency and error handling, beyond simply providing a connection."),
          copy("Với kho ngoại quan, TNT đã giới thiệu nhóm nghiệp vụ hỗ trợ quản lý dữ liệu tờ khai, cập nhật trạng thái và xuất dữ liệu theo mẫu. Khi triển khai, doanh nghiệp cần đánh giá riêng yêu cầu chứng từ, hệ thống kết nối và quy trình đối soát của mình để xác định phạm vi phù hợp.", "For bonded warehouses, TNT has described functions supporting declaration data management, status updates and formatted data exports. Implementation needs a separate assessment of each business's documents, connected systems and reconciliation workflows to define the right scope."),
        ],
      },
      {
        heading: copy("Bắt đầu từ luồng hàng cần kiểm soát", "Start with the stock flow that needs control"),
        paragraphs: [
          copy("Doanh nghiệp nên chọn một luồng nhập xuất có đủ các bước khách hàng, kho và vận tải để khảo sát. Xác định dữ liệu cần cập nhật, người chịu trách nhiệm và thời điểm xác nhận trước khi mở rộng sang báo cáo hoặc tích hợp sâu hơn.", "Choose an inbound or outbound flow involving customers, warehouse staff and transport for the initial survey. Define required updates, owners and confirmation points before expanding reporting or deeper integrations."),
          copy("Nếu đang xây dựng dữ liệu nền, bài viết về các dữ liệu kho cần theo dõi thường xuyên là điểm bắt đầu. Bài toán logistics bổ sung lớp điều phối nhiều bên và kết nối đối tác trên nền tảng đó.", "If you are still establishing core data, the article on warehouse data to monitor regularly is a starting point. Logistics adds multi-party coordination and partner integration to that foundation."),
        ],
      },
    ],
  },
  {
    slug: "quan-tri-hop-nhat-sme-thuong-mai",
    title: copy("Doanh nghiệp thương mại SME tăng tốc với nền tảng quản trị hợp nhất", "Helping trading SMEs move faster with unified management"),
    summary: copy("Kết nối khách hàng, bán hàng, mua hàng và kho để doanh nghiệp vừa và nhỏ theo dõi hoạt động trên cùng một nền tảng dữ liệu.", "Connect customers, sales, purchasing and inventory so small and medium-sized businesses can manage operations on one data platform."),
    topic: "ERP", status: "approved", author: "TNT / Trí Nghĩa Tech",
    publishedAt: "2026-04-05", dateLabel: "05/04/2026", readingTime: "4 phút đọc",
    image: "/images/legacy/265-0.webp",
    imageAlt: copy("Quản trị khách hàng và bán hàng cho doanh nghiệp thương mại SME", "Customer and sales management for trading SMEs"),
    sourceUrl: "https://tringhiatech.vn/vi/doanh-nghiep-smes-thuong-mai-tang-toc-van-hanh-nho-nen-tang-quan-tri-hop-nhat-n265",
    relatedArticleSlugs: ["chuan-bi-erp", "quan-ly-kho-logistics", "erp-du-lieu"],
    relatedServiceHref: "/dich-vu/erp", relatedServiceLabel: "Tìm hiểu ERP",
    relatedLinks: [
      { href: "/dich-vu/erp#erp-crm", label: copy("Phân hệ Khách hàng / CRM", "Customer / CRM module") },
      { href: "/dich-vu/erp#erp-mua-hang", label: copy("Phân hệ Mua hàng", "Purchasing module") },
      { href: "/dich-vu/erp#erp-kho", label: copy("Phân hệ Kho / WMS", "Inventory / WMS module") },
    ],
    sections: [
      {
        heading: copy("Vì sao dữ liệu rời rạc cản trở doanh nghiệp thương mại?", "Why fragmented data holds trading businesses back"),
        paragraphs: [
          copy("SME là nhóm doanh nghiệp nhỏ và vừa. Với doanh nghiệp thương mại, khách hàng, báo giá, đơn hàng, mua hàng và tồn kho liên quan trực tiếp đến nhau. Khi mỗi bộ phận giữ một file riêng, lãnh đạo mất thời gian tổng hợp và khó nhìn đồng thời doanh thu, công nợ, hàng sẵn có và nhu cầu bổ sung.", "SMEs are small and medium-sized enterprises. In trading businesses, customers, quotations, orders, purchasing and inventory are closely connected. When each department keeps separate files, leaders spend time consolidating data and struggle to see revenue, receivables, available stock and replenishment needs together."),
          copy("Thiếu liên thông cũng ảnh hưởng đến người thực hiện. Nhân viên kinh doanh phải hỏi lại lịch sử khách hàng; mua hàng khó bám nhu cầu bán; kho cập nhật chậm khiến quyết định đặt thêm hoặc cam kết giao hàng thiếu cơ sở.", "Disconnected data also affects staff. Sales teams must ask for customer history, purchasing cannot easily follow demand, and delayed stock updates weaken replenishment and delivery decisions."),
        ],
      },
      {
        heading: copy("CRM và bán hàng dùng chung lịch sử khách hàng", "CRM and sales share customer history"),
        paragraphs: [
          copy("Dữ liệu khách hàng cần được chuẩn hóa để liên kết khách hàng tiềm năng, cơ hội, báo giá, hợp đồng và đơn hàng. Đội ngũ kinh doanh có thể theo dõi quá trình làm việc trên cùng hồ sơ thay vì phụ thuộc vào thông tin do từng cá nhân lưu giữ.", "Standardized customer data connects prospects, opportunities, quotations, contracts and orders. Sales teams can follow interactions in a shared record rather than depending on information kept by individuals."),
          copy("TNM tổ chức các nghiệp vụ CRM và bán hàng theo hướng liên thông. Trạng thái báo giá, bước phê duyệt và chuyển tiếp sang đơn hàng giúp doanh nghiệp xây dựng quy trình từ tiếp cận khách hàng đến xử lý giao dịch.", "TNM connects CRM and sales operations. Quotation status, approval steps and conversion to orders help businesses build a workflow from initial contact to transaction processing."),
        ],
      },
      {
        heading: copy("Mua hàng bám nhu cầu bán và tồn kho", "Aligning purchasing with demand and stock"),
        paragraphs: [
          copy("Mua hàng cần theo dõi nhà cung cấp, giá mua, đề xuất và đơn hàng mua trong quan hệ với nhu cầu hàng hóa. Kết nối tồn kho và kế hoạch bán giúp bộ phận cung ứng có dữ liệu để cân nhắc thời điểm, số lượng đặt hàng và tiến độ giao của nhà cung cấp.", "Purchasing needs supplier, price, request and purchase order records in the context of product demand. Connecting inventory and sales plans gives supply teams data to assess timing, order quantities and supplier delivery progress."),
          copy("Ở kho, doanh nghiệp cần thống nhất nhập xuất, điều chuyển, kiểm kê và báo cáo tồn. Các thông tin về hàng tồn lâu ngày hoặc dưới mức tối thiểu hỗ trợ việc kiểm soát quay vòng hàng hóa và hạn chế quyết định mua dựa trên số liệu cũ.", "Warehouse operations need consistent receipts, dispatches, transfers, stocktaking and reporting. Aging and below-minimum stock information supports turnover management and reduces purchasing decisions based on outdated figures."),
        ],
      },
      {
        heading: copy("Mở rộng tích hợp và tự động hóa theo từng giai đoạn", "Expanding integrations and automation in stages"),
        paragraphs: [
          copy("Doanh nghiệp có thể bắt đầu từ CRM, bán hàng, mua hàng và kho, sau đó đánh giá nhu cầu kết nối hóa đơn điện tử, giao vận, thanh toán hoặc website. Mỗi tích hợp cần có phạm vi và quy trình đối soát cụ thể.", "Businesses can begin with CRM, sales, purchasing and inventory, then assess electronic invoicing, shipping, payment or website integrations. Each integration needs a defined scope and reconciliation process."),
          copy("Khi dữ liệu đã được chuẩn hóa, các hướng ứng dụng AI như tóm tắt lịch sử khách hàng, gợi ý chăm sóc và cảnh báo đơn hàng có thể được xem xét. Lộ trình nên xuất phát từ bài toán thực tế và mức độ sẵn sàng của dữ liệu, đồng thời làm rõ yêu cầu bảo mật và kiểm tra kết quả.", "Once data is standardized, AI uses such as summarizing customer history, suggesting follow-ups and flagging order risks can be evaluated. The roadmap should reflect real needs and data readiness, with clear privacy requirements and output checks."),
        ],
      },
    ],
  },
  {
    slug: "chuyen-doi-so-truong-pho-thong",
    title: copy("Chuyển đổi số trường phổ thông: từ dữ liệu rời rạc đến điều hành thông minh", "Digital transformation in schools: from fragmented data to informed management"),
    summary: copy("Dữ liệu học sinh, giáo viên, lịch học, học phí và tương tác phụ huynh cần được liên thông để hỗ trợ quản trị trường học và giảm công việc tổng hợp thủ công.", "Connected student, teacher, timetable, fee and parent communication data supports school management and reduces manual consolidation."),
    topic: "Giáo dục", status: "approved", author: "TNT / Trí Nghĩa Tech",
    publishedAt: "2026-03-10", dateLabel: "10/03/2026", readingTime: "4 phút đọc",
    image: "/images/legacy/262-0.webp",
    imageAlt: copy("Nền tảng quản trị trường học TN EDU trên Web và Mobile", "TN EDU school management on web and mobile"),
    sourceUrl: "https://tringhiatech.vn/vi/chuyen-doi-so-truong-pho-thong-tu-du-lieu-roi-rac-den-dieu-hanh-thong-minh-n262",
    relatedArticleSlugs: ["quan-tri-hop-nhat-sme-thuong-mai", "khi-nao-outsourcing"],
    relatedProjectSlugs: ["lomonoxop-my-dinh"],
    relatedServiceHref: "/dich-vu/outsourcing", relatedServiceLabel: copy("Trao đổi về phần mềm quản lý trường học", "Discuss school management software"),
    sections: [
      {
        heading: copy("Một nhà trường cần một dòng dữ liệu nhất quán", "A school needs consistent information flows"),
        paragraphs: [
          copy("Trường phổ thông, đặc biệt là trường liên cấp, phải phối hợp nhiều nghiệp vụ: hồ sơ học sinh, lớp học, giáo viên, thời khóa biểu, học phí, xe tuyến và hoạt động ngoại khóa. Nếu thông tin nằm ở nhiều file hoặc ứng dụng riêng, mỗi lần tổng hợp báo cáo lại cần đối chiếu thủ công.", "Schools, particularly those spanning multiple educational stages, coordinate student records, classes, teachers, timetables, fees, buses and extracurricular activities. When information sits in separate files or applications, every consolidated report requires manual reconciliation."),
          copy("Chuyển đổi số cần gắn việc sử dụng công cụ với chuẩn hóa dữ liệu và quy trình. Mục tiêu là để ban giám hiệu, bộ phận hành chính và giáo viên cùng khai thác thông tin nhất quán trong phạm vi được phân quyền.", "Digital transformation should combine tools with standardized data and workflows. School leaders, administrative staff and teachers need consistent information within their assigned permissions."),
        ],
      },
      {
        heading: copy("Kết nối các nghiệp vụ quản lý nhà trường", "Connecting school management processes"),
        image: { src: "/images/legacy/262-1.webp", alt: copy("Dashboard tổng quan quản trị trường học TN EDU", "TN EDU school management dashboard"), width: 1600, height: 730 },
        paragraphs: [
          copy("TN EDU được xây dựng theo hướng quản trị tập trung trên Web và Mobile. Các nhóm dữ liệu gồm năm học, khối lớp, lớp, môn học, giáo viên và học sinh được tổ chức để hỗ trợ những nghiệp vụ như phân công giảng dạy, thời khóa biểu, điểm danh và kết quả học tập.", "TN EDU is designed for centralized management on web and mobile. Academic years, grade groups, classes, subjects, teachers and students are organized to support teaching assignments, timetables, attendance and learning results."),
          copy("Thông tin học sinh cũng liên quan đến học phí, đăng ký xe, câu lạc bộ và thực đơn. Khi dùng chung dữ liệu nền, nhà trường giảm việc nhập lại và có cơ sở đối chiếu giữa các bộ phận. Phạm vi tích hợp thiết bị điểm danh hoặc hệ thống khác cần được xác định theo hiện trạng của từng trường.", "Student information also connects with fees, bus registration, clubs and menus. Shared core records reduce repeated entry and provide a basis for reconciliation across departments. Attendance device and external system integrations need to reflect each school's existing setup."),
        ],
      },
      {
        heading: copy("Giáo viên và phụ huynh tham gia cùng quy trình", "Bringing teachers and parents into the workflow"),
        image: { src: "/images/legacy/262-2.webp", alt: copy("Quản lý hoạt động câu lạc bộ trên TN EDU", "Club activity management in TN EDU"), width: 1600, height: 742 },
        paragraphs: [
          copy("Giáo viên cần cập nhật điểm danh, kết quả học tập, nhận xét và trao đổi với phụ huynh thuận tiện. Phụ huynh cần theo dõi lịch học, học phí, xe đưa đón, thực đơn hoặc gửi yêu cầu nghỉ phép mà không phải tìm thông tin trên nhiều kênh.", "Teachers need convenient ways to record attendance, results, observations and parent communication. Parents need to follow schedules, fees, school buses and menus or request an absence without searching multiple channels."),
          copy("Ứng dụng di động tạo một kênh kết nối gắn với hồ sơ học sinh. Việc phân quyền và xác định người cập nhật giúp nhà trường giữ được trách nhiệm quản lý dữ liệu trong khi mở rộng khả năng tiếp cận thông tin cho gia đình.", "A mobile app provides a communication channel linked to student records. Permissions and defined update responsibilities help the school retain data ownership while giving families better access to information."),
        ],
      },
      {
        heading: copy("Từ báo cáo tập trung đến hỗ trợ điều hành", "From consolidated reporting to management support"),
        paragraphs: [
          copy("Dữ liệu tập trung là nền tảng để tổng hợp tình hình học sinh, chuyên cần, học phí và hoạt động theo khối hoặc lớp. Báo cáo cần trả lời các câu hỏi điều hành cụ thể, thay vì chỉ tăng số lượng biểu đồ.", "Centralized data provides a foundation for reporting on students, attendance, fees and activities by grade or class. Reports should answer concrete management questions rather than simply add more charts."),
          copy("Những hướng mở rộng như truy vấn báo cáo bằng ngôn ngữ tự nhiên hoặc cảnh báo biến động chuyên cần cần được đánh giá sau khi dữ liệu đủ chất lượng. Ứng dụng AI trong giáo dục đòi hỏi kiểm soát quyền truy cập, bảo vệ thông tin học sinh và có người kiểm tra trước khi sử dụng kết quả để ra quyết định.", "Extensions such as natural language report queries or attendance trend alerts should be evaluated once data quality is sufficient. Educational AI requires access controls, protection of student information and human review before outputs inform decisions."),
        ],
      },
    ],
  },
];
