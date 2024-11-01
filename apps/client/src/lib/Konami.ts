import React from 'react';

export default function Konami({ triggerSnow }: { triggerSnow: () => void }) {
  const konamiCode = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      if (e.key === konamiCode[index]) {
        setIndex((prev) => prev + 1);
        console.log('index', index);
      } else {
        setIndex(0);
      }
    };
    if (index === konamiCode.length) {
      triggerSnow();
      setIndex(0);
    }
    window.addEventListener('keydown', keydownHandler);
    return () => {
      window.removeEventListener('keydown', keydownHandler);
    };
  }, [index, triggerSnow]);

  return null;
}
