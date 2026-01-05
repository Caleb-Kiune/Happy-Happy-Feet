import { useState, useEffect } from 'react';

export function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
    const [isAtTop, setIsAtTop] = useState(true);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const updateScrollDirection = () => {
            const scrollY = window.scrollY;

            // Threshold for being "at the top"
            setIsAtTop(scrollY < 50);

            const direction = scrollY > lastScrollY ? 'down' : 'up';

            // Only update if we've scrolled more than 10px to prevent jitter
            if (Math.abs(scrollY - lastScrollY) > 10) {
                setScrollDirection(direction);
            }

            lastScrollY = scrollY > 0 ? scrollY : 0;
        };

        window.addEventListener('scroll', updateScrollDirection);
        // Initial check
        updateScrollDirection();

        return () => window.removeEventListener('scroll', updateScrollDirection);
    }, []);

    return { scrollDirection, isAtTop };
}
