import Link from "next/link";
import { Button } from "./ui/button";

function Unauthenticated() {
  return (
    <div className="min-h-[95%] w-full flex flex-col justify-center items-center gap-4">
      <span className="text-9xl font-bold">401</span>
      <div className="flex items-center gap-2">
        Unauthenticated!{" "}
        <Link href={"/"}>
          <Button>Home</Button>
        </Link>
      </div>
    </div>
  );
}

export default Unauthenticated;
