import { Button } from "@/components/ui/button";
import ImageCard from "./_components/ImageCard";

export default function Home() {
  return (
    <main className=" flex justify-start items-center flex-col">
      <div className=" w-full border-b flex justify-center items-center bg-white text-[48px] py-4 mb-6">
        GEMINI VISION
      </div>
      <ImageCard />
    </main>
  );
}
