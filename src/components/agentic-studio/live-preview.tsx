"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LivePreview = () => (
    <div className="h-full bg-white rounded-lg overflow-hidden">
         <div className="w-full h-full">
            <div className="flex items-center justify-center h-full bg-gray-100">
                <Card className="w-full max-w-md p-2 border">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center text-gray-800 font-grotesk">Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-6">
                        <div className="space-y-1">
                            <Label htmlFor="email-preview" className="text-sm font-medium text-gray-700">Email</Label>
                            <Input id="email-preview" type="email" className="text-gray-900" placeholder="your@email.com"/>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password-preview" className="text-sm font-medium text-gray-700">Password</Label>
                            <Input id="password-preview" type="password" className="text-gray-900" />
                        </div>
                        <Button type="button" className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={(e) => e.preventDefault()}>
                            Log In
                        </Button>
                      </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);
