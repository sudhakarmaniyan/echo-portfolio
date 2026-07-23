import React from 'react';
import { Monitor, Code, Palette } from 'lucide-react';

export const servicesData = [
  {
    id: '01',
    title: 'UI/UX Design',
    subtitle: 'Strategic & conversion-focused',
    description: 'We design intuitive and stunning interfaces that engage users and drive conversions. Every pixel is placed with purpose.',
    icon: <Monitor size={32} strokeWidth={1.5} />,
    color: '#FF6B6B'
  },
  {
    id: '02',
    title: 'Web Development',
    subtitle: 'Blazing fast & scalable',
    description: 'Our engineers build robust, scalable, and lightning-fast applications using the latest modern web technologies.',
    icon: <Code size={32} strokeWidth={1.5} />,
    color: '#4facfe'
  },
  {
    id: '03',
    title: 'Brand Identity',
    subtitle: 'Stand out from the crowd',
    description: 'We craft unique digital identities that tell your story and resonate deeply with your target audience.',
    icon: <Palette size={32} strokeWidth={1.5} />,
    color: '#a881d2'
  }
];
