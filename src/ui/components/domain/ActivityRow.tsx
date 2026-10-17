import { Pressable, Text, View } from 'react-native';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  Bookmark,
  Layers,
  Pencil,
  Star,
  type LucideIcon,
} from 'lucide-react-native';

import type { ActivityEventType, ActivityItem } from '@/shared/types/models';
import { Avatar } from '@/ui/components/primitives/Avatar';
import { CoverThumb } from '@/ui/components/cover/CoverThumb';
import { useThemeColors } from '@/ui/theme/ThemeProvider';
import { iconTokens } from '@/ui/theme/tokens';

const EVENT_ICON: Record<ActivityEventType, LucideIcon> = {
  review_posted: Pencil,
  rating_set: Star,
  character_rating_set: Star,
  tracking_status_changed: Bookmark,
  list_created: Layers,
  list_item_added: Layers,
};

const EVENT_VERB: Record<ActivityEventType, string> = {
  review_posted: 'reviewed',
  rating_set: 'rated',
  character_rating_set: 'rated',
  tracking_status_changed: 'updated reading status for',
  list_created: 'created a list',
  list_item_added: 'added to a list',
};

function relativeTime(value: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return formatDistanceToNowStrict(date, { addSuffix: true });
}

interface ActivityRowProps {
  item: ActivityItem;
  onPress?: () => void;
}

export function ActivityRow({ item, onPress }: ActivityRowProps) {
  const colors = useThemeColors();
  const Icon = EVENT_ICON[item.eventType];
  const title =
    item.target.kind === 'character' ? item.target.name : item.target.title;
  const coverImage = item.target.kind === 'pornhwa' ? item.target.coverImage : null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.actor.username} ${EVENT_VERB[item.eventType]} ${title}`}
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center gap-md border-b border-border px-lg py-md active:bg-card"
    >
      <View>
        <Avatar uri={item.actor.avatarImage} name={item.actor.username} size={32} />
        <View className="absolute -bottom-1 -right-1 h-4 w-4 items-center justify-center rounded-full bg-primary">
          <Icon size={10} strokeWidth={2} color={colors.onPrimary} />
        </View>
      </View>
      <View className="flex-1">
        <Text className="text-caption text-foreground" numberOfLines={2}>
          <Text className="font-inter-bold">{item.actor.username} </Text>
          <Text className="text-muted">
            {EVENT_VERB[item.eventType]} {item.target.kind === 'list' ? '' : title}
          </Text>
        </Text>
        <Text className="text-[11px] text-muted">{relativeTime(item.occurredAt)}</Text>
      </View>
      {coverImage !== null || item.target.kind === 'pornhwa' ? (
        <CoverThumb uri={coverImage} width={28} height={42} />
      ) : null}
      {item.target.kind === 'character' && item.target.image ? (
        <Avatar uri={item.target.image} name={item.target.name} size={36} />
      ) : null}
      {item.target.kind === 'list' ? (
        <Layers size={iconTokens.size.action} strokeWidth={iconTokens.stroke} color={colors.muted} />
      ) : null}
    </Pressable>
  );
}
