import { useState } from 'react';
import { useRouter } from 'expo-router';

import { getRandomPicks } from '@/api/endpoints/discover';
import { toSeries } from '@/logic/mappers/pornhwa';
import { useRootStore } from '@/logic/store';
import type { Series } from '@/shared/types/models';

export interface UseRandomPicksOptions {
  count?: number;
  orientation?: 'yaoi' | 'yuri';
}

export function useRandomSeries() {
  const router = useRouter();
  const pushToast = useRootStore((state) => state.pushToast);
  const [isPickingRandom, setIsPickingRandom] = useState(false);

  /**
   * Fetches random series candidates based on optional filters.
   */
  const fetchRandom = async (options: UseRandomPicksOptions = {}): Promise<Series[]> => {
    const params: Record<string, string | number> = {
      count: options.count ?? 10,
    };
    if (options.orientation) {
      params.orientation = options.orientation;
    }

    const res = await getRandomPicks(params);
    return res.data.map(toSeries);
  };

  /**
   * "Surprise Me": Picks a single random series and immediately opens its detail page.
   */
  const surpriseMe = async (orientation?: 'yaoi' | 'yuri') => {
    if (isPickingRandom) return;
    setIsPickingRandom(true);
    try {
      const picks = await fetchRandom({ count: 5, orientation });
      if (picks.length > 0 && picks[0]) {
        const randomPick = picks[Math.floor(Math.random() * picks.length)] ?? picks[0];
        router.push(`/pornhwa/${randomPick.slug}`);
      } else {
        pushToast('No random picks available at the moment', 'info');
      }
    } catch {
      pushToast('Failed to pick a random manhwa', 'error');
    } finally {
      setIsPickingRandom(false);
    }
  };

  return {
    fetchRandom,
    surpriseMe,
    isPickingRandom,
  };
}
