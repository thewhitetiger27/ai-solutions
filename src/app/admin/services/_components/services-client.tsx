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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import { ServiceForm } from './service-form';
import { ServiceActions } from './service-actions';
import type { Service } from '@/lib/mock-data';

type ServicesClientProps = {
  services: Service[];
}

export function ServicesClient({ services }: ServicesClientProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Services</CardTitle>
                <CardDescription>Add, edit, or remove company services.</CardDescription>
            </div>
            <ServiceForm>
              <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Service
              </Button>
            </ServiceForm>
        </div>
      </CardHeader>
      <CardContent>
        {services.length > 0 ? (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Service Title</TableHead>
                <TableHead>Short Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {services.map(service => (
                <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.title}</TableCell>
                    <TableCell className="max-w-sm truncate">{service.short_description}</TableCell>
                    <TableCell className="text-right">
                        <ServiceActions service={service} />
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        ) : (
             <div className="text-center py-10 border-dashed border-2 rounded-lg">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="w-8 h-8" />
                    <h3 className="text-lg font-semibold">Could not load services</h3>
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
