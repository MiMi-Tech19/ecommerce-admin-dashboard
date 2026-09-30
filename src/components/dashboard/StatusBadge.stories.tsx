import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatusBadge } from './StatusBadge';

const meta = {
  title: 'Dashboard/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    status: {
      control: 'select',
      options: [
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ],
    },
  },
  args: {
    status: 'delivered',
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: {
    status: 'pending',
  },
};

export const Processing: Story = {
  args: {
    status: 'processing',
  },
};

export const Shipped: Story = {
  args: {
    status: 'shipped',
  },
};

export const Delivered: Story = {
  args: {
    status: 'delivered',
  },
};

export const Cancelled: Story = {
  args: {
    status: 'cancelled',
  },
};