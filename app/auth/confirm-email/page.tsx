import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

function page() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card>
        <CardContent className="space-y-4 text-center">
          Please confirm your email to sign up, go to your email!
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-center items-center gap-1">
          <span>Are you using Gmail ?</span>
          <Link href="https://mail.google.com/">
            <Button variant={"outline"} className="cursor-pointer">Open My Gmail Inbox</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default page;
