import type { AxiosInstance } from "axios";
import type { FarmerNidFormValues } from "@/lib/schemas/auth";

export async function submitFarmerNid(api: AxiosInstance, data: FarmerNidFormValues) {
  const formData = new FormData();

  formData.append("nidNumber", data.nidNumber);
  formData.append("nidName", data.nidName);
  formData.append("dob", data.dob);
  formData.append("address[district]", data.address.district);
  formData.append("address[upazila]", data.address.upazila);
  formData.append("address[village]", data.address.village);
  formData.append("address[fullAddress]", data.address.fullAddress);

  if (data.nidFront) formData.append("nidFront", data.nidFront);
  if (data.nidBack) formData.append("nidBack", data.nidBack);

  return api.put("/farmers/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}