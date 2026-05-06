import { useEffect, useState, useRef } from 'react';

const AnimatedCounter = ({ from = 0, to = 100, duration = 2, suffix = '', className = '', decimals = 0 }) => {
  const [count, setCount] = useState(from);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easedProgress = easeOutQuart(progress);
      setCount(Math.floor(easedProgress * (to - from) + from) + (decimals > 0 ? (easedProgress * Math.pow(10, decimals) % 1 * Math.pow(10, decimals)) / Math.pow(10, decimals) : 0));
      if (progress < 1 && mounted.current) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    return () => {
      mounted.current = false;
    };
  }, [from, to, duration, decimals]);

  const easeOutQuart = (t) => 1 - (--t) * t * t * t;

  return (
    <span className={className}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter;

