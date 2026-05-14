import { redirect } from "next/navigation";

export default function AdminPortfolioRedirect() {
  redirect("/dashboard/content?tab=portfolio");
}
