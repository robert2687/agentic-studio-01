
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14">
          <div
            className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-[-120px] lg:-mr-64"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                AI-Powered Development, Reimagined
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Agentic Studio provides a seamless, AI-driven environment to take
                your ideas from concept to deployment. Build, test, and deploy
                with a team of intelligent agents at your command.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button>
                  Get started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="ghost">
                  Learn more <span aria-hidden="true">→</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
