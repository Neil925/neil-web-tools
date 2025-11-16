'use client';
import { Progress } from '@/components/ui/progress';
import { redirect, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Redurect() {
  const searchParams = useSearchParams();
  const issues: string[] = [];

  const delayString = searchParams.get('delay');
  if (delayString === null) {
    issues.push('Missing "delay" url parameter.');
  }

  let url = searchParams.get('url');
  if (url === null) {
    issues.push('Missing "url" url parameter.');
  }

  const delay = delayString === null ? NaN : Number.parseFloat(delayString);

  if (isNaN(delay)) {
    issues.push('The argument for "delay" is not a valid number.');
  }

  if (issues.length) {
    return (
      <div className='flex flex-col w-screen h-screen justify-center items-center'>
        <h1 className='text-3xl mb-3'>Cannot redirect due to some issues...</h1>
        <ul className='text-lg flex flex-col'>
          {issues.map((param, key) => (
            <li key={key}>- {param}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (!url?.startsWith('https://')) {
    url = 'https://' + url;
  }

  const timeUnit = 10;
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  let [progress, setProgress] = useState(0.0);

  useEffect(() => {
    console.log(delay);

    const timer = setInterval(() => setProgress(p => {
      const update = p + (timeUnit / 1000);

      if (update >= delay) {
        clearInterval(timerRef.current);
        redirect(url!);
      }

      return update;
    }), timeUnit);
    timerRef.current = timer;
  }, []);

  return (
    <div className='flex flex-col w-screen h-screen justify-center items-center'>
      <h2 className='text-3xl mb-2'>Redirecting in {(delay - progress).toFixed(2)}s...</h2>
      <Progress value={progress / (delay / 100)} max={delay} className='max-w-96' />
    </div>
  );
}
