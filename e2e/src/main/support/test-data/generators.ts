import {
  getFakeEmail,
  getFakeFullName,
  getFakePhoneNumber,
  getFakeTenCharUniqueId
} from "../data-generator";

type GeneratorFn = () => Promise<string> | string;

const registry: Record<string, GeneratorFn> = {
  "fake.email": () => getFakeEmail(),
  "fake.fullName": () => getFakeFullName(),
  "fake.phone": () => getFakePhoneNumber(),
  "fake.uniqueId10": () => getFakeTenCharUniqueId()
};

export async function generateValue(generatorKey: string): Promise<string> {
  const fn = registry[generatorKey];
  if (!fn) {
    throw new Error(
      `Unknown generator "${generatorKey}". Available: ${Object.keys(registry).join(", ")}`
    );
  }
  const val = await fn();
  return String(val);
}
