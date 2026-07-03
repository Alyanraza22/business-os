import { redirect } from "next/navigation";

/** Legacy route — the sign-in experience now lives at /signin. */
export default function LoginPage() {
  redirect("/signin");
}
