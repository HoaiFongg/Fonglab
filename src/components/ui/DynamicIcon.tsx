'use client';

import React from 'react';
import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  if (!name) return <Icons.Globe {...props} />;

  // Try finding matching icon name in lucide
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<LucideProps>>)[name];

  if (!IconComponent) {
    return <Icons.Globe {...props} />;
  }

  return <IconComponent {...props} />;
};
