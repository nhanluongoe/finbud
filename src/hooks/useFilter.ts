import { useState } from 'react';

export type DateFilter = {
  month: number;
  year: number;
};

const now = new Date();

export default function useFilter() {
  const [date, setDate] = useState<DateFilter>({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const setMonth = (month: number) => {
    setDate((d) => ({
      ...d,
      month,
    }));
  };

  const setYear = (year: number) => {
    setDate((d) => ({
      ...d,
      year,
    }));
  };

  return { date, setMonth, setYear };
}
