'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Loader2, ClipboardList } from 'lucide-react';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import type { Intervention } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';

const FormSchema = z.object({
  name: z.string().min(3, 'Scenario name must be at least 3 characters.'),
  description: z.string().optional(),
  interventions: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: 'You have to select at least one intervention.',
    }),
});

type AddScenarioFormProps = {
  allInterventions: Intervention[];
  isLoading: boolean;
};

export function AddScenarioForm({ allInterventions, isLoading }: AddScenarioFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      description: '',
      interventions: [],
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    // In a real app, you would save this to Firestore.
    console.log('New Scenario Payload:', data);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace with: await addScenario(data);
      
      toast({
        title: 'Scenario Added',
        description: `Successfully added "${data.name}".`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Failed to add scenario:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add new scenario. Please try again.',
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
          Add Scenario
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Scenario</DialogTitle>
          <DialogDescription>
            Define a new simulation scenario by selecting a set of interventions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scenario Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., High-Efficiency Deployment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the main goal of this scenario..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interventions"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Select Interventions</FormLabel>
                    <FormDescription>
                      Choose which interventions to include in this simulation.
                    </FormDescription>
                  </div>
                  <ScrollArea className="h-40 rounded-md border p-4">
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    ) : (
                        allInterventions.map((item) => (
                        <FormField
                            key={item.id}
                            control={form.control}
                            name="interventions"
                            render={({ field }) => {
                            return (
                                <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0 py-2"
                                >
                                <FormControl>
                                    <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                        return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                            (value) => value !== item.id
                                            )
                                        );
od
                                    }}
                                    />
                                </FormControl>
                                <FormLabel className="font-normal leading-tight">
                                    {item.systemId} - {item.type}
                                    <p className="text-xs text-muted-foreground">{item.zoneId}</p>
                                </FormLabel>
                                </FormItem>
                            );
                            }}
                        />
                        ))
                    )}
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Scenario
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
