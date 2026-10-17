import type { ListDetailDTO, ListSummaryDTO } from '@/api/endpoints/lists';
import type { UserListDTO } from '@/api/endpoints/users';
import type { ListDetail, ListItem, ListSummary, UserList } from '@/shared/types/models';

export function toListSummary(
  dto: Omit<ListSummaryDTO, 'coverImages'> & { coverImages?: string[] | null },
): ListSummary {
  return {
    slug: dto.slug ?? '',
    title: dto.title ?? 'Untitled list',
    description: dto.description ?? null,
    isPublic: dto.isPublic ?? true,
    likeCount: dto.likeCount ?? 0,
    itemCount: dto.itemCount ?? 0,
    coverImages: (dto.coverImages ?? []).filter((image): image is string => Boolean(image)),
    uid: dto.uid ?? '',
    username: dto.username ?? null,
    avatarImage: dto.avatarImage ?? null,
    isCollaborative: false,
    createdAt: dto.createdAt ?? '',
    updatedAt: dto.updatedAt ?? '',
  };
}

export function toListItem(dto: ListDetailDTO['items'] extends (infer T)[] | undefined ? T : never): ListItem {
  return {
    id: dto.id ?? 0,
    pornhwaId: dto.pornhwaId ?? 0,
    position: dto.position ?? 0,
    title: dto.title ?? null,
    slug: dto.slug ?? null,
    coverImage: dto.coverImage ?? null,
    status: dto.status ?? null,
    notes: dto.notes ?? null,
    addedByUsername: dto.addedByUsername ?? null,
  };
}

export function toListDetail(dto: ListDetailDTO): ListDetail {
  return {
    ...toListSummary(dto),
    isCollaborative: dto.isCollaborative ?? false,
    items: (dto.items ?? []).map(toListItem),
    collaborators: (dto.collaborators ?? []).map((collaborator) => ({
      uid: collaborator.uid ?? '',
      username: collaborator.username ?? '',
      avatarImage: collaborator.avatarImage ?? null,
      addedAt: collaborator.addedAt ?? '',
    })),
  };
}

export function toUserList(dto: UserListDTO): UserList {
  return {
    id: dto.id ?? 0,
    slug: dto.slug ?? '',
    title: dto.title ?? 'Untitled list',
    description: dto.description ?? null,
    isPublic: dto.isPublic ?? true,
    likeCount: dto.likeCount ?? 0,
    itemCount: dto.itemCount ?? 0,
    coverImages: (dto.coverImages ?? []).filter((image): image is string => Boolean(image)),
    uid: dto.uid ?? '',
    username: dto.username ?? null,
    avatarImage: dto.avatarImage ?? null,
    isCollaborative: false,
    createdAt: dto.createdAt ?? '',
    updatedAt: dto.updatedAt ?? '',
  };
}
