import { SignUp } from "@clerk/nextjs";
import Layout from "@/app/(auth)/layout";

export default function Page() {
  return (
    <Layout>
      <SignUp />
    </Layout>
  );
}
