import {
  Activity,
  AddCircle,
  ArrowDown2,
  ArrowLeft2,
  ArrowRight2,
  ArrowUp2,
  Book1,
  Briefcase,
  Box,
  Buildings2,
  Call,
  Chart,
  ClipboardTick,
  CloseCircle,
  Code1,
  Data,
  Diagram,
  DocumentDownload,
  DocumentText,
  InfoCircle,
  Layer,
  MagicStar,
  Menu,
  Message,
  Money,
  Monitor,
  MessageQuestion,
  People,
  ScanBarcode,
  SearchNormal1,
  Setting4,
  Setting2,
  ShieldTick,
  ShoppingCart,
  TickCircle,
  type Icon as IconsaxIcon,
} from "iconsax-react";
import type { ComponentProps } from "react";

const icons = {
  activity: Activity,
  addCircle: AddCircle,
  arrowDown: ArrowDown2,
  arrowLeft: ArrowLeft2,
  arrowRight: ArrowRight2,
  arrowUp: ArrowUp2,
  book: Book1,
  briefcase: Briefcase,
  box: Box,
  building: Buildings2,
  call: Call,
  chart: Chart,
  checklist: ClipboardTick,
  closeCircle: CloseCircle,
  code: Code1,
  data: Data,
  diagram: Diagram,
  document: DocumentText,
  download: DocumentDownload,
  faq: MessageQuestion,
  info: InfoCircle,
  layer: Layer,
  magic: MagicStar,
  menu: Menu,
  message: Message,
  money: Money,
  monitor: Monitor,
  people: People,
  scan: ScanBarcode,
  search: SearchNormal1,
  setting: Setting2,
  settings: Setting4,
  shield: ShieldTick,
  shoppingCart: ShoppingCart,
  tickCircle: TickCircle,
} satisfies Record<string, IconsaxIcon>;

export type IconName = keyof typeof icons;

type Props = Omit<ComponentProps<IconsaxIcon>, "variant"> & {
  name: IconName;
};

export function Icon({ name, size = 20, color = "currentColor", ...props }: Props) {
  const IconComponent = icons[name];

  return (
    <IconComponent
      aria-hidden="true"
      color={color}
      focusable="false"
      size={size}
      variant="Linear"
      {...props}
    />
  );
}
