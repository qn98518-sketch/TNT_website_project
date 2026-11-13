import NextImage, { type ImageProps } from 'next/image';
import { resolveMedia } from '@/lib/media';

type Props = ImageProps & { mediaKind?: 'photo' | 'cutout' | 'background' };

export function SiteImage({ src, className = '', mediaKind, ...props }: Props) {
  const value = typeof src === 'string' ? resolveMedia(src) : src;
  const cutout = typeof value === 'string' && /laptop|reason-|erp-display|process-|service-|implementation-|challenge-/.test(value);
  const kind = mediaKind ?? (cutout ? 'cutout' : 'photo');
  return <NextImage {...props} src={value} className={`tnt-media ${className}`} data-media-kind={kind} data-media-fill={props.fill ? 'true' : undefined} />;
}
