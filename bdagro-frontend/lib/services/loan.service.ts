import type { AxiosInstance } from "axios";
import type { LoanApplicationFormValues } from "@/lib/schemas/loan";

export interface LoanProduct {
  _id: string;
  name: string;
  category: string;
  description?: string;
  minAmount: number;
  maxAmount: number;
  profitSharePercent: number;
  maxDurationMonths: number;
}

export async function listLoanProducts(api: AxiosInstance) {
  const response = await api.get<{ products: LoanProduct[] }>("/loan-products");
  return response.data.products;
}

export async function createLoanApplication(api: AxiosInstance, data: LoanApplicationFormValues) {
  const formData = new FormData();
  formData.append("loanProduct", data.loanProduct);
  formData.append("requestedAmount", String(data.requestedAmount));
  formData.append("durationMonths", String(data.durationMonths));
  formData.append("projectTitle", data.projectTitle);
  formData.append("projectDescription", data.projectDescription);
  formData.append("location", data.location);
  formData.append("landArea", String(data.landArea));
  formData.append("expectedHarvestDate", data.expectedHarvestDate);
  if (data.cropType) formData.append("cropType", data.cropType);
  if (data.landDeed) formData.append("landDeed", data.landDeed);
  if (data.incomeProof) formData.append("incomeProof", data.incomeProof);
  data.farmImages.forEach((image) => formData.append("farmImages", image));

  const response = await api.post("/farmers/loan-applications", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}