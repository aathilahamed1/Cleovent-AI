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
import { useZones } from '@/hooks/use-zones';
import { addIntervention } from '@/app/actions/interventions';

const interventionTypes = [
  'Amine Scrubber', 'Roadside DAC', 'Vertical Garden', 'Algal Bioreactor', 'Biofilter'
] as const;

const interventionStatuses = ['Simulated', 'Proposed', 'Deployed'] as const;

const FormSchema = z.object({
  systemId: z.string().min(3, 'System ID must be at least 3 characters.'),
  type: z.enum(interventionTypes),
  zoneId: z.string({ required_error: 'Please select a zone.' }),
  status: z.enum(interventionStatuses),
  estimatedImpact: z.coerce.number().positive('Impact must be a positive number.'),
  lat: z.coerce.number().min(-90).max(90, 'Latitude must be between -90 and 90.'),
  lng: z.coerce.number().min(-180).max(180, 'Longitude must be between -180 and 180.'),
  ratedAirflow: z.coerce.number().optional(),
  removalEfficiency: z.coerce.number().optional(),
  energyUse: z.coerce.number().optional(),
});

export function AddInterventionForm() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { zones, isLoading: isLoadingZones } = useZones();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      systemId: `CCS${Math.floor(100 + Math.random() * 900)}`,
      estimatedImpact: 0,
      lat: 10.79,
      lng: 78.65,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    try {
      await addIntervention({
        systemId: data.systemId,
        type: data.type,
        zoneId: data.zoneId,
        status: data.status,
        estimatedImpact: data.estimatedImpact,
        placement: { lat: data.lat, lng: data.lng },
        parameters: {
          ratedAirflow: data.ratedAirflow,
          removalEfficiency: data.removalEfficiency,
          energyUse: data.energyUse,
        }
      });
      toast({
        title: 'Intervention Added',
        description: `Successfully added ${data.systemId}.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Failed to add intervention:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add new intervention. Please try again.',
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
          Add Intervention
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Intervention</DialogTitle>
          <DialogDescription>
            Enter the details for the new intervention unit.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="systemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CCS004" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {interventionTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {interventionStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="zoneId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associated Zone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger disabled={isLoadingZones}>
                        <SelectValue placeholder={isLoadingZones ? "Loading zones..." : "Select a zone"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {zones?.map(zone => <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedImpact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Impact (tCO₂/day)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 45" {...field} />
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
                Save Intervention
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
