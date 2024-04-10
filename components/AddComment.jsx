import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { Checkbox } from "./ui/checkbox";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email(),
  comment: z
    .string()
    .min(5, { message: "Comment must be at least 5 characters" }),
  checking: z.boolean().default(false).optional(),
});

const AddComment = ({ id }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      comment: "",
      checking: false, // Include default value for the checkbox
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      const { fullName, email, comment } = values;
      setLoading(true);
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          comment,
          id,
        }),
      });

      toast.success("Successfully posted comment");

      form.reset({
        fullName: "",
        email: "",
        comment: "",
        checking: false,
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div className="mt-[56px]">
        <div>
          <h2 className="text-[#3B444F] font-[700] text-[24px] mb-[16px]">
            Leave a comment
          </h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="h-[145px]"
                        placeholder="Your comment goes here."
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid lg:grid-cols-2 lg:gap-x-5 lg:gap-y-0 gap-y-5">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Full Name"
                            {...field}
                            disabled={loading}
                            className="h-[48px] px-[52px]"
                          />
                          <div className="absolute top-[8px] left-[12px] ">
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 32 32"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_154_2206)">
                                <path
                                  d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z"
                                  stroke="#EE1B22"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M16 17.3335C18.2091 17.3335 20 15.5426 20 13.3335C20 11.1244 18.2091 9.3335 16 9.3335C13.7909 9.3335 12 11.1244 12 13.3335C12 15.5426 13.7909 17.3335 16 17.3335Z"
                                  fill="#EE1B22"
                                  stroke="#EE1B22"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M8.22412 25.1322C8.55413 24.0338 9.22941 23.0711 10.1498 22.3868C11.0702 21.7025 12.1866 21.3332 13.3335 21.3335H18.6668C19.8151 21.3331 20.9329 21.7034 21.854 22.3892C22.775 23.0751 23.4501 24.0399 23.7788 25.1402"
                                  stroke="#EE1B22"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_154_2206">
                                  <rect width="32" height="32" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Email Address"
                            {...field}
                            disabled={loading}
                            className="h-[48px] px-[52px]"
                          />
                          <div className="absolute top-[8px] left-[12px] ">
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 32 32"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <mask
                                id="mask0_154_2234"
                                maskType="luminance"
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="32"
                                height="32"
                              >
                                <path d="M0 0h32v32H0V0Z" fill="white" />
                              </mask>
                              <g mask="url(#mask0_154_2234)">
                                <path
                                  d="M4.66563 10.0442C4.24961 9.76699 4 9.30058 4 8.80101V8.79976C4 7.91659 4.71602 7.20061 5.59925 7.20061H26.4009C27.2841 7.20061 28.0001 7.91659 28.0001 8.79976V8.80056V8.80101C28.0001 9.30058 27.7505 9.76699 27.3345 10.0442C25.3045 11.3978 19.1876 15.4754 16.8877 17.009C16.3501 17.3674 15.6501 17.3674 15.1125 17.009C12.8125 15.4754 6.69564 11.3978 4.66563 10.0442Z"
                                  stroke="#EE1B22"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M4 8.80023V23.2003C4 23.6247 4.1684 24.0315 4.4688 24.3315C4.7688 24.6319 5.17561 24.8003 5.6 24.8003H26.4001C26.8245 24.8003 27.2313 24.6319 27.5313 24.3315C27.8317 24.0315 28.0001 23.6247 28.0001 23.2003V8.80023"
                                  stroke="#EE1B22"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="checking"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-[8px]">
                        <div>
                          <Checkbox
                            {...field}
                            className="rounded-[4px] w-[16px] h-[16px] border-[1px]  border-[#6F6767] -mt-10"
                          />
                        </div>
                        <p className="text-[14px] font-[400] text-[#6F6767]">
                          I consent to the Terms & Conditions and authorize the
                          publication of my comment, including my name.
                        </p>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="bg-[#EE1B22] hover:bg-[#EE1B22]/80 h-[46px] w-[159px] rounded-[6px] "
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AddComment;
