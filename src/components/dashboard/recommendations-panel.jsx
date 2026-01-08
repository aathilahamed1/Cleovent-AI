'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lightbulb, Loader2, Sparkles, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { getRecommendations } from '@/app/actions/recommendations';
import type { Recommendation } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

const recommendationGoals = [
  { id: 'cost', label: 'Minimize Cost' },
  { id: 'capture', label: 'Maximize CO₂ Capture' },
  { id: 'space', label: 'Minimize Space Usage' },
] as const;

const FormSchema = z.object({
  goals: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: 'You have to select at least one optimization goal.',
    }),
});

export default function RecommendationsPanel() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      goals: ['capture'],
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setRecommendations([]);
    try {
      const result = await getRecommendations(data.goals);
      if (result?.suggestions) {
        setRecommendations(result.suggestions);
        toast({
          title: 'Recommendations Generated',
          description: `Found ${result.suggestions.length} optimal interventions.`,
        });
      } else {
        throw new Error('No suggestions returned from AI.');
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'Could not generate recommendations. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg">
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="goals"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Optimization Goals
                    </FormLabel>
                    <FormDescription>
                      Select goals to prioritize for AI recommendations.
                    </FormDescription>
                  </div>
                  {recommendationGoals.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="goals"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
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
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Suggestions
            </Button>
          </form>
        </Form>
        {(isLoading || recommendations.length > 0) && (
          <div className="mt-6">
            <h3 className="mb-2 font-semibold">Suggested Interventions:</h3>
            <ScrollArea className="h-48">
              {isLoading && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Lightbulb className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">
                        {rec.interventionType} in {rec.zoneId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {rec.reasoning}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
