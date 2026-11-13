import Link from "next/link";
import { PageFrame } from "@/components/site-shell";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
  return (
    <PageFrame>
      <main className="not-found-page">
        <div className="container not-found-card">
          <span className="eyebrow">404 / KHÔNG TÌM THẤY</span>
          <h1>Trang này chưa có.</h1>
          <p>
            Đường dẫn có thể chưa đúng hoặc nội dung chưa được TNT duyệt để
            công bố.
          </p>
          <Link className="button button-primary" href="/">
            Về trang chủ <Icon name="arrowLeft" size={17} />
          </Link>
        </div>
      </main>
    </PageFrame>
  );
}
