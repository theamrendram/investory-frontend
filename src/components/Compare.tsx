import React from "react";
import { Input } from "./ui/input";
import { SendIcon } from "lucide-react";
import { Button } from "./ui/button";

const Compare = () => {
  return (
    <section className=" bg-white min-h-screen px-8">
      <p className="text-xl font-semibold">Compare</p>
      <div className="flex gap-4 mt-4">
        <Input placeholder="Compare with" />
        <Input placeholder="Compare with" />
        <Button className="flex items-center w-[200px] text-lg" variant={"secondary"}>Go</Button>
      </div>
    </section>
  );
};

export default Compare;
