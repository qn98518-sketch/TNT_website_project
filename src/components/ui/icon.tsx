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
  Bag2,
  BoxSearch,
  BoxTick,
  Building4,
  Buildings2,
  Call,
  Chart,
  ClipboardTick,
  CloseCircle,
  Code1,
  CodeCircle,
  Cloud,
  Convert3DCube,
  Cpu,
  Data,
  Diagram,
  Designtools,
  DocumentDownload,
  DocumentText,
  DocumentCopy,
  DocumentFilter,
  Driver,
  Facebook,
  Global,
  Hierarchy,
  InfoCircle,
  Layer,
  Link21,
  MagicStar,
  Menu,
  Message,
  MessageText,
  Mobile,
  Money,
  Monitor,
  MessageQuestion,
  People,
  Profile2User,
  ProfileDelete,
  ScanBarcode,
  SearchNormal1,
  Setting4,
  Setting2,
  ShieldTick,
  ShieldSearch,
  ShoppingCart,
  TickCircle,
  TaskSquare,
  Teacher,
  Timer,
  UserAdd,
  UserRemove,
  WalletMoney,
  ChartSuccess,
  CloseSquare,
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
  bag: Bag2,
  boxSearch: BoxSearch,
  boxTick: BoxTick,
  building4: Building4,
  building: Buildings2,
  call: Call,
  chart: Chart,
  checklist: ClipboardTick,
  closeCircle: CloseCircle,
  code: Code1,
  codeCircle: CodeCircle,
  cloud: Cloud,
  convert: Convert3DCube,
  cpu: Cpu,
  data: Data,
  diagram: Diagram,
  designTools: Designtools,
  document: DocumentText,
  documentCopy: DocumentCopy,
  documentFilter: DocumentFilter,
  driver: Driver,
  facebook: Facebook,
  global: Global,
  hierarchy: Hierarchy,
  download: DocumentDownload,
  faq: MessageQuestion,
  info: InfoCircle,
  layer: Layer,
  link: Link21,
  magic: MagicStar,
  menu: Menu,
  message: Message,
  messageText: MessageText,
  mobile: Mobile,
  money: Money,
  monitor: Monitor,
  people: People,
  profile: Profile2User,
  profileDelete: ProfileDelete,
  scan: ScanBarcode,
  search: SearchNormal1,
  setting: Setting2,
  settings: Setting4,
  shield: ShieldTick,
  shieldSearch: ShieldSearch,
  shoppingCart: ShoppingCart,
  tickCircle: TickCircle,
  taskSquare: TaskSquare,
  teacher: Teacher,
  timer: Timer,
  userAdd: UserAdd,
  userRemove: UserRemove,
  wallet: WalletMoney,
  chartSuccess: ChartSuccess,
  closeSquare: CloseSquare,
} satisfies Record<string, IconsaxIcon>;

export type IconName = keyof typeof icons;

type Props = Omit<ComponentProps<IconsaxIcon>, "variant"> & {
  name: IconName;
  purpose?: "content" | "control";
};

const controlIcons = new Set<IconName>(["arrowDown", "arrowLeft", "arrowRight", "arrowUp", "addCircle", "closeCircle", "menu", "search"]);

export function Icon({ name, size = 20, color = "currentColor", purpose, ...props }: Props) {
  const IconComponent = icons[name];

  return (
    <IconComponent
      aria-hidden="true"
      color={color}
      focusable="false"
      size={size}
      variant="Linear"
      data-iconsax={name}
      data-icon-purpose={purpose ?? (controlIcons.has(name) ? "control" : "content")}
      {...props}
    />
  );
}
