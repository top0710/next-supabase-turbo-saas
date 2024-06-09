import { cache } from 'react';

import { createCmsClient } from '@kit/cms';

/**
 * @name getDocs
 * @description Load the documentation pages.
 * @param language
 */
export const getDocs = cache(docsLoader);

async function docsLoader(language: string | undefined) {
  const cms = await createCmsClient();

  const { items: pages } = await cms.getContentItems({
    collection: 'documentation',
    language,
    limit: Number.MAX_SAFE_INTEGER,
  });

  return pages;
}
