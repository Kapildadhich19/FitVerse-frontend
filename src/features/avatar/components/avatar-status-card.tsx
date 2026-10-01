'use client';

import { AlertTriangle, CheckCircle2, Clock, Loader2 } from 'lucide-react';

import type { AvatarStatus } from '@/features/avatar/schemas/avatar.schema';

const statusCopy: Record<
  AvatarStatus,
  { label: string; description: string; icon: typeof Clock }
> = {
  queued: {
    label: 'Queued',
    description: 'Your avatar is waiting to be processed.',
    icon: Clock,
  },
  processing: {
    label: 'Processing',
    description: 'The avatar pipeline is working on this request.',
    icon: Loader2,
  },
  completed: {
    label: 'Completed',
    description: 'Your generated avatar is ready to view.',
    icon: CheckCircle2,
  },
  failed: {
    label: 'Failed',
    description: 'The avatar job failed. Replace photos and try again.',
    icon: AlertTriangle,
  },
};

export function AvatarStatusCard({
  status,
}: Readonly<{ status: AvatarStatus }>) {
  const copy = statusCopy[status];
  const Icon = copy.icon;

  return (
    <section className="rounded-lg border bg-card p-5 text-card-foreground">
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-primary/10 p-2 text-primary">
          <Icon
            className={`h-5 w-5 ${status === 'processing' ? 'animate-spin' : ''}`}
          />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Avatar status</p>
          <h2 className="mt-1 text-xl font-semibold">{copy.label}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {copy.description}
          </p>
        </div>
      </div>
    </section>
  );
}
