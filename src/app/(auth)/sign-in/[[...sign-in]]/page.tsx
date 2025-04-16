import { SignIn } from "@clerk/nextjs";
import Layout from "@/app/(auth)/layout";

export default function Page() {
  return (
    <Layout>
      <SignIn />
    </Layout>
  );
}
