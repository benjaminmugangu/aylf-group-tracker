// src/app/dashboard/reports/submit/components/ReportForm.tsx
"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Report } from "@/lib/types";
import { UploadCloud, FileText, Send } from "lucide-react";
import Image from "next/image";

const reportFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  level: z.enum(["national", "site", "small_group"], { required_error: "Please select a level" }),
  siteId: z.string().optional(), // Potentially refine based on selected level
  smallGroupId: z.string().optional(), // Potentially refine
  content: z.string().min(20, "Report content must be at least 20 characters"),
  financialSummary: z.string().optional(),
  images: z.custom<FileList>().optional(), // For file input
});

type ReportFormData = z.infer<typeof reportFormSchema>;

interface ReportFormProps {
  onSubmitSuccess?: (data: Report) => void;
}

export function ReportForm({ onSubmitSuccess }: ReportFormProps) {
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, register, watch, formState: { errors }, reset } = useForm<ReportFormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: "",
      level: undefined,
      content: "",
      financialSummary: "",
    }
  });

  const watchedLevel = watch("level");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const processSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const submittedReport: Report = {
      id: `rep_${Date.now()}`,
      submittedBy: "current_user_id_mock", // Replace with actual user ID from auth
      submissionDate: new Date().toISOString(),
      ...data,
      images: selectedFiles.map(file => ({ name: file.name, url: URL.createObjectURL(file) })), // Mock URL
    };
    
    console.log("Report Submitted:", submittedReport);
    toast({
      title: "Report Submitted Successfully!",
      description: `Your report "${data.title}" has been recorded.`,
      variant: "default",
    });
    reset();
    setSelectedFiles([]);
    onSubmitSuccess?.(submittedReport);
    setIsSubmitting(false);
  };

  return (
    <Card className="shadow-xl w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <FileText className="mr-3 h-7 w-7 text-primary" />
          Submit New Report
        </CardTitle>
        <CardDescription>Fill in the details below to submit your activity report.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="title">Report Title</Label>
            <Input id="title" {...register("title")} placeholder="e.g., Q3 Youth Workshop Summary" className="mt-1" />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="level">Report Level</Label>
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="level" className="mt-1">
                    <SelectValue placeholder="Select report level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="national">National</SelectItem>
                    <SelectItem value="site">Site</SelectItem>
                    <SelectItem value="small_group">Small Group</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.level && <p className="text-sm text-destructive mt-1">{errors.level.message}</p>}
          </div>

          {/* TODO: Conditional inputs for Site ID / Small Group ID based on level */}
          {/* For now, these would be manually entered or selected from a list */}

          <div>
            <Label htmlFor="content">Report Content / Details</Label>
            <Textarea id="content" {...register("content")} placeholder="Describe the activity, outcomes, challenges, etc." rows={6} className="mt-1" />
            {errors.content && <p className="text-sm text-destructive mt-1">{errors.content.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="financialSummary">Financial Summary (Optional)</Label>
            <Textarea id="financialSummary" {...register("financialSummary")} placeholder="Brief overview of income, expenses, or donations." rows={3} className="mt-1" />
            {errors.financialSummary && <p className="text-sm text-destructive mt-1">{errors.financialSummary.message}</p>}
          </div>

          <div>
            <Label htmlFor="images">Upload Images (Optional)</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md hover:border-primary transition-colors">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="flex text-sm text-muted-foreground">
                  <label
                    htmlFor="images"
                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring"
                  >
                    <span>Upload files</span>
                    <Input id="images" type="file" {...register("images")} onChange={handleFileChange} className="sr-only" multiple accept="image/*" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            {selectedFiles.length > 0 && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative aspect-square group">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`preview ${file.name}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                        <p className="text-white text-xs text-center p-1 break-all">{file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
             {errors.images && <p className="text-sm text-destructive mt-1">{typeof errors.images.message === 'string' ? errors.images.message : "Error with image upload"}</p>}
          </div>

          <Button type="submit" className="w-full py-3 text-base" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" /> Submit Report
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
