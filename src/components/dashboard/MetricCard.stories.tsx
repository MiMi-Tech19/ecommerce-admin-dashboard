import type { Meta, StoryObj } from '@storybook/react-vite';
import { DollarSign } from 'lucide-react';

import { MetricCard } from './MetricCard';

const meta = {
  title: 'Dashboard/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    title: 'Total Revenue',
    value: '$24,850.75',
    change: '+12.5% from last month',
    icon: DollarSign,
  },
} satisfies Meta<typeof MetricCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Orders: Story = {
  args: {
    title: 'Total Orders',
    value: '342',
    change: '+8.2% from last month',
  },
};

export const Products: Story = {
  args: {
    title: 'Conversion Rate',
    value: '4.8%',
    change: '-1.2%',
    positive: false,
  },
};