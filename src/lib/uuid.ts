import { UUID } from "crypto";
import { v4 } from "uuid";

export function createUUID() {
  return v4() as UUID;
}
