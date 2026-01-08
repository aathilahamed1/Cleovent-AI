'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addZone } from '@/app/actions/zones';

const zoneTypes = [
  'Industrial', 'Transport', 'Commercial', 'Residential', 
  'Urban Park', 'Power Plant', 'Waterfront', 'University'
] as const;

const FormSchema = z.object({
  name: z.string().min(3, 'Zone name must be at least 3 characters.'),
  type: z.enum(zoneTypes),
  baseEmissions: z.coerce.number().positive('Emissions must be a positive number.'),
  lat: z.coerce.number().min(-90).max(90, 'Latitude must be between -90 and 90.'),
  lng: z.coerce.number().min(-180).max(180, 'Longitude must be between -180 and 180.'),
});

export function AddZoneForm() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      baseEmissions: 0,
      lat: 10.79,
      lng: 78.65
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    try {
      await addZone({
        name: data.name,
        type: data.type,
        baseEmissions: data.baseEmissions,
        placement: { lat: data.lat, lng: data.lng },
      });
      toast({
        title: 'Zone Added',
        description: `Successfully added ${data.name}.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Failed to add zone:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add new zone. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Zone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Zone</DialogTitle>
          <DialogDescription>
            Enter the details for the new zone. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Industrial Zone B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zone Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a zone type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {zoneTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="baseEmissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Base Emissions (tCO₂/day)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 1500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10.79" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 78.65" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Zone
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
