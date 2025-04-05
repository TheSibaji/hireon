import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import useFetch from "@/hooks/use-fetch";
import { addNewCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define Zod schema for validation
const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file &&
        file.length > 0 &&
        ["image/png", "image/jpeg"].includes(file[0]?.type),
      { message: "Only Images are allowed" }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      logo: null,
    },
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  const navigate = useNavigate(); // Initialize navigation

  // Handle form submission
  const onSubmit = (data) => {
    fnAddCompany({
      ...data,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies(); // Refresh companies list
      navigate(0); // Reload the post-job page
    }
  }, [dataAddCompany]); // Trigger useEffect when a company is added

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 p-4 pb-0">
          {/* Company Name Field */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Company name" />
            )}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          {/* Logo Field */}
          <Controller
            name="logo"
            control={control}
            render={({ field }) => (
              <Input
                type="file"
                accept="image/*"
                className="file:text-gray-500"
                onChange={(event) => field.onChange(event.target.files)}
              />
            )}
          />
          {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}

          {/* Add Button */}
          <Button
            type="submit"
            variant="destructive"
            className="w-40"
            disabled={loadingAddCompany}
          >
            Add
          </Button>
        </form>

        {/* Error Messages */}
        {errorAddCompany?.message && (
          <p className="text-red-500">{errorAddCompany?.message}</p>
        )}
        {loadingAddCompany && <BarLoader width={"100%"} color="#36d7b7" />}

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
