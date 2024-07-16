import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { PlusIcon } from "lucide-react";

export default async function Page() {
  return (
    <main className="flex min-h-screen h-screen flex-col items-center justify-between w-full">
      <section>
        <div className="flex h-screen justify-center items-center">
          <div className="text-center flex flex-col gap-4 w-full ">
            <h1 className="text-8xl font-bold">
              Urban Dictionary Bot
            </h1>
            <span className="text-2xl text-gray-200">
              A simple Discord Bot that fetches definitions from the Urban Dictionary
            </span>
            <Image src="/assets/demo.gif" alt="Demo" width={600} height={350} className="rounded-lg place-self-center" />
            <Link href={"/add"}>
              <Button>
                <PlusIcon className="pr-2" />
                Add
              </Button>
            </Link>
          </div>
        </div>
        {/* float on bottom left */}
        <div className="fixed bottom-0 left-0 p-4 flex flex-row gap-4">
          <a href="/tos">TOS</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
        {/* float on bottom right */}
        <div className="fixed bottom-0 right-0 p-4 flex flex-row gap-4">
          <a href="https://github.com/Badbird5907/urban-dictionary-bot">GitHub</a>
        </div>
      </section>
    </main>
  )
}
