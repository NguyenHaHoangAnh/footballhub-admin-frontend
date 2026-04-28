import { useEffect, useState } from "react";

export function useDebounce(value: string, delay: number) {
    const [debounced, setDebounced] = useState<string>(value);

    useEffect(() => {
        const timerId = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timerId);
    }, [value, delay]);
    
    return debounced;
}