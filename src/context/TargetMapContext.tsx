import { createContext, useContext, useState } from 'react';

interface ITargetMapContext {
  targetMap: Map<number, string>;
}

interface ISetTargetMapContext {
  setTargetMap: React.Dispatch<React.SetStateAction<Map<number, string>>>;
}

const TargetMapContext = createContext<ITargetMapContext>({ targetMap: new Map() });

const SetTargetMapContext = createContext<ISetTargetMapContext>({ setTargetMap: () => null });

export default function TargetMapProvider({ children }: { children: React.ReactNode }) {
  const [targetMap, setTargetMap] = useState(new Map());

  return (
    <TargetMapContext.Provider value={{ targetMap }}>
      <SetTargetMapContext.Provider value={{ setTargetMap }}>
        {children}
      </SetTargetMapContext.Provider>
    </TargetMapContext.Provider>
  );
}

export function useTargetMap() {
  const context = useContext(TargetMapContext);

  if (!context) {
    throw new Error('useTargetMap must be used within a TargetMapProvider');
  }

  return context;
}

export function useSetTargetMap() {
  const context = useContext(SetTargetMapContext);

  if (!context) {
    throw new Error('useSetTargetMap must be used within a TargetMapProvider');
  }

  return context;
}
