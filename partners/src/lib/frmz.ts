import { z, ZodTypeAny } from "zod";

// ------------------ Core Types ------------------
type Proxiable = object | any[];
type BlobLike = Blob | File;
export type DeepWritable<T> = {
  -readonly [K in keyof T]: T[K] extends object ? DeepWritable<T[K]> : T[K];
};

// ------------------ Type Guards ------------------
const isProxiable = (v: unknown): v is Proxiable =>
  typeof v === "object" && v !== null;

const isBlobLike = (v: unknown): v is BlobLike =>
  v instanceof Blob || v instanceof File;

const isProxiableNotBlob = (v: unknown): v is Proxiable =>
  isProxiable(v) && !isBlobLike(v);

// ------------------ Schema Inference ------------------
function inferValueSchema(value: unknown): ZodTypeAny {
  if (isProxiableNotBlob(value)) return inferSchema(value);
  if (isBlobLike(value)) return z.instanceof(Blob);
  if (typeof value === "string") return z.string();
  if (typeof value === "number") return z.number();
  if (typeof value === "boolean") return z.boolean();
  if (value === null) return z.null();
  if (value === undefined) return z.undefined();
  return z.unknown();
}

function inferSchema<T>(data: T): z.ZodType<T> {
  if (Array.isArray(data)) {
    const types = data.map(inferValueSchema);
    return z.array(
      types.length > 0
        ? z.union(types as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]])
        : z.unknown(),
    ) as unknown as z.ZodType<T>;
  }

  if (isProxiableNotBlob(data)) {
    const shape = Object.fromEntries(
      Object.keys(data).map((k) => [k, inferValueSchema((data as any)[k])]),
    );
    return z.object(shape) as unknown as z.ZodType<T>;
  }

  return (isBlobLike(data)
    ? z.instanceof(Blob)
    : z.unknown()) as unknown as z.ZodType<T>;
}

// ------------------ Proxy Setup ------------------
const handler: ProxyHandler<Proxiable> = {
  set(target, property, value) {
    Reflect.set(
      target,
      property,
      isProxiableNotBlob(value) ? createDeepProxy(value, handler) : value,
    );
    return true;
  },
};

function createDeepProxy<T extends Proxiable>(
  target: T,
  handler: ProxyHandler<T>,
): T {
  for (const key of Object.keys(target)) {
    const value = (target as any)[key];
    if (isProxiableNotBlob(value)) {
      (target as any)[key] = createDeepProxy(value, handler);
    }
  }
  return new Proxy(target, handler);
}

// ------------------ FormData Serialization ------------------
function appendToFormData(formData: FormData, data: unknown, key = ""): void {
  if (Array.isArray(data)) {
    data.forEach((value, i) =>
      appendToFormData(formData, value, key ? `${key}[${i}]` : `${i}`),
    );
  } else if (isProxiableNotBlob(data)) {
    for (const [k, value] of Object.entries(data)) {
      appendToFormData(formData, value, key ? `${key}[${k}]` : k);
    }
  } else if (key) {
    formData.append(key, isBlobLike(data) ? data : String(data));
  }
}

// ------------------ Main API ------------------
export function frmz<T extends Proxiable>(
  initialData: T,
): { data: T; getFormData: () => FormData };

export function frmz<T extends ZodTypeAny>(
  initialData: z.infer<T>,
  schema: T,
): { data: z.infer<T>; getFormData: () => FormData };

export function frmz<T extends Proxiable>(
  initialData: T,
  schema?: ZodTypeAny,
): { data: any; getFormData: () => FormData } {
  if (!isProxiable(initialData)) {
    throw new Error(
      "createFormDataManager only supports object and array root types",
    );
  }

  const data = createDeepProxy(
    structuredClone((schema ?? inferSchema(initialData)).parse(initialData)),
    handler,
  );

  return {
    data,
    getFormData: () => {
      const formData = new FormData();
      appendToFormData(formData, data);
      return formData;
    },
  };
}
