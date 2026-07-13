import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CounterProps {
  value: string;
  duration?: number;
}

export const Counter: React.FC<CounterProps> = ({ value, duration = 1.5 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    // Extract the numeric portion of the string
    const numericMatch = value.match(/[\d,.]+/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const numericStr = numericMatch[0];
    const rawNumber = parseFloat(numericStr.replace(/,/g, ''));
    const isDecimal = numericStr.includes('.');
    const decimalPlaces = isDecimal ? numericStr.split('.')[1].length : 0;
    const hasCommas = numericStr.includes(',');

    const prefix = value.substring(0, value.indexOf(numericStr));
    const suffix = value.substring(value.indexOf(numericStr) + numericStr.length);

    let startTime: number | null = null;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Easing out quad: t * (2 - t)
      const easedProgress = progress * (2 - progress);
      const current = easedProgress * rawNumber;

      let formattedNum = current.toFixed(decimalPlaces);
      if (hasCommas) {
        const parts = formattedNum.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        formattedNum = parts.join('.');
      }

      setDisplayValue(`${prefix}${formattedNum}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [value, duration, isInView]);

  return (
    <span ref={ref} className="tabular-nums inline-block">
      {displayValue}
    </span>
  );
};
