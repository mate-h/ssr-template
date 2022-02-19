import { AttributifyAttributes } from "windicss/types/jsx";

declare module "preact" {
  interface Attributes extends AttributifyAttributes {}
}
