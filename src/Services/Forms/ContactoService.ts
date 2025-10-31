import apiAuth from "../../api/apiAuth";

function buildFormData(formData: Record<string, any>) {
  const fd = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      fd.append(key, value);
    }
  });
  return fd;
}

export async function sendQueja(formData: Record<string, any>): Promise<void> {
  await apiAuth.post("quejas", buildFormData(formData), {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

export async function sendReporte(formData: Record<string, any>): Promise<void> {
  await apiAuth.post("/reportes", buildFormData(formData), {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

export async function sendSugerencia(formData: Record<string, any>): Promise<void> {
  await apiAuth.post("/sugerencias", buildFormData(formData), {
    headers: { "Content-Type": "multipart/form-data" }
  });
}