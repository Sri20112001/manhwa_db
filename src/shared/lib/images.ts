import type { ImageProps } from 'expo-image';

export const BLURHASH = {
  cover: 'L03?Z}xu00of~qofM{of00RjM{of',
  portrait: 'L5H2EC=PM+yV0g-mq.wG9c010J}I',
  avatar: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
  backdrop: 'L6Pj0^i_.AyE_3t7t7R**0o#DgR4',
} as const;

export type ImagePlaceholder = keyof typeof BLURHASH;

export function remoteImage(
  uri: string | null | undefined,
  placeholder: ImagePlaceholder = 'cover',
): Pick<ImageProps, 'source' | 'placeholder' | 'placeholderContentFit' | 'transition'> {
  return {
    source: uri ? { uri } : null,
    placeholder: uri ? undefined : BLURHASH[placeholder],
    placeholderContentFit: 'cover',
    transition: 250,
  };
}
