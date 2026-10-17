import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check } from '@/ui/icons';

import { useListEditor } from '@/logic/hooks/useListEditor';
import { Button } from '@/ui/components/primitives/Button';
import { GlassHeader } from '@/ui/components/layout/GlassHeader';
import { IconButton } from '@/ui/components/primitives/IconButton';
import { Input } from '@/ui/components/primitives/Input';
import { Screen } from '@/ui/components/layout/Screen';
import { Switch } from '@/ui/components/primitives/Switch';

export function CreateListScreen() {
  const router = useRouter();
  const { save } = useListEditor();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setIsSubmitting(true);
    await save({
      title: title.trim(),
      description: description.trim() || undefined,
      isPublic: !isPrivate,
      isCollaborative,
      itemIds: [],
    });
    setIsSubmitting(false);
    router.back();
  };

  return (
    <Screen edges={['top']}>
      <GlassHeader
        edge={false}
        left={
          <IconButton
            icon={ArrowLeft}
            accessibilityLabel="Back"
            onPress={() => router.back()}
          />
        }
        title="New custom list"
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-xl p-lg">
        <View className="gap-sm">
          <Text className="text-caption font-inter-semibold text-muted">TITLE *</Text>
          <Input
            placeholder="e.g. Best Romance Manhwa 2026"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View className="gap-sm">
          <Text className="text-caption font-inter-semibold text-muted">DESCRIPTION</Text>
          <Input
            placeholder="Add an optional description of your list..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            containerClassName="h-28 items-start py-sm"
          />
        </View>

        <View className="gap-md rounded-md border border-border bg-card p-md">
          <View className="flex-row items-center justify-between">
            <View className="gap-xs">
              <Text className="text-body font-inter-semibold text-foreground">Private list</Text>
              <Text className="text-caption text-muted">Only you can view this list</Text>
            </View>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              accessibilityLabel="Private list"
            />
          </View>

          <View className="h-px bg-border" />

          <View className="flex-row items-center justify-between">
            <View className="gap-xs">
              <Text className="text-body font-inter-semibold text-foreground">
                Collaborative list
              </Text>
              <Text className="text-caption text-muted">Allow other users to suggest items</Text>
            </View>
            <Switch
              value={isCollaborative}
              onValueChange={setIsCollaborative}
              accessibilityLabel="Collaborative list"
            />
          </View>
        </View>
      </ScrollView>

      <View className="border-t border-border bg-card p-lg">
        <Button
          label="Create list"
          icon={Check}
          onPress={handleSubmit}
          disabled={!title.trim() || isSubmitting}
          loading={isSubmitting}
          fullWidth
        />
      </View>
    </Screen>
  );
}
