'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import { EventForm } from './event-form';
import { EventActions } from './event-actions';
import type { Event } from '@/lib/mock-data';

type EventsClientProps = {
  events: Event[];
}

export function EventsClient({ events }: EventsClientProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Events</CardTitle>
            <CardDescription>Add, edit, or remove company events.</CardDescription>
          </div>
          <EventForm>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </EventForm>
        </div>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {events.map(event => (
                <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>
                    <Badge variant={event.is_past ? 'secondary' : 'default'}>
                        {event.is_past ? 'Past' : 'Upcoming'}
                    </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <EventActions event={event} />
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        ) : (
            <div className="text-center py-10 border-dashed border-2 rounded-lg">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="w-8 h-8" />
                    <h3 className="text-lg font-semibold">Could not load events</h3>
                    <p className="text-sm">
                        Please ensure you have enabled the Firestore API and seeded the database.
                    </p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
