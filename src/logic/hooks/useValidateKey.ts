import { useCallback, useState } from 'react';

import { connectAccount } from '@/logic/usecases/connectAccount';

export function useValidateKey() {
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(async (key: string): Promise<boolean> => {
    setIsValidating(true);
    setError(null);
    const result = await connectAccount(key);
    setIsValidating(false);
    if (!result.ok) {
      setError(result.error ?? 'Could not validate the key.');
      return false;
    }
    return true;
  }, []);

  return { validate, isValidating, error, clearError: () => setError(null) };
}
