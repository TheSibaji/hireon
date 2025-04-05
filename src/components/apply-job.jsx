import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/use-fetch";
import { applyToJob } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";
import { Button } from "./ui/button";

// React.forwardRef added to Input to resolve ref warnings
const InputWithRef = React.forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

// Validation schema
const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "Experience must not be less than 0" })
    .int(),
  skills: z
    .string()
    .min(1, { message: "Skills are required" }),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),
  resume: z
    .any()
    .refine(
      (file) =>
        file &&
        file.length > 0 &&
        ["application/pdf", "application/msword"].includes(file[0]?.type),
      { message: "Only PDF or Word documents are allowed" }
    ),
});

// Main drawer component
const ApplyJobDrawer = ({ user, job, applied = false, fetchJob }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { loading: loadingApply, error: errorApply, fn: fnApply } =
    useFetch(applyToJob);

  const onSubmit = (data) => {
    fnApply({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "applied",
      resume: data.resume[0],
    }).then(() => {
      fetchJob();
      reset();
    });
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          variant={job?.isOpen && !applied ? "blue" : "destructive"}
          disabled={!job?.isOpen || applied}
        >
          {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Apply for {job?.title} at {job?.company?.name}
          </DrawerTitle>
          <DrawerDescription>Please fill out the form below</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-0">
          <InputWithRef
            type="number"
            placeholder="Year of Experience"
            {...register("experience", {
              valueAsNumber: true,
            })}
          />
          {errors.experience && (
            <p className="text-red-500">{errors.experience.message}</p>
          )}

          <InputWithRef
            type="text"
            placeholder="Skills (Comma Separated)"
            {...register("skills")}
          />
          {errors.skills && (
            <p className="text-red-500">{errors.skills.message}</p>
          )}

          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} value={field.value}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Graduate" id="graduate" />
                  <Label htmlFor="graduate">Graduate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Post Graduate" id="post-graduate" />
                  <Label htmlFor="post-graduate">Post Graduate</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.education && (
            <p className="text-red-500">{errors.education.message}</p>
          )}

          <InputWithRef
            type="file"
            accept=".pdf, .doc, .docx"
            {...register("resume")}
          />
          {errors.resume && (
            <p className="text-red-500">{errors.resume.message}</p>
          )}
          {errorApply?.message && (
            <p className="text-red-500">{errorApply?.message}</p>
          )}

          {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}

          <Button type="submit" variant="blue" size="lg">
            Submit
          </Button>
        </form>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJobDrawer;

//// most of the logics here are very tough, be care full while next time try to modify this