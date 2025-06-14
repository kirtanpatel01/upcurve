// app/reset/page.tsx

import { Suspense } from 'react';
import ResetClientComponenet from './ResetClientComponent';
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetClientComponenet />
    </Suspense>
  );
}

