import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/app/components/ProfileForm";
import { ProfilePasswordForm } from "@/app/components/ProfilePasswordForm";
export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight"></h1>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="account" className="w-full ">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="account" className="w-1/2">
                  Account
                </TabsTrigger>
                <TabsTrigger value="password" className="w-1/2">
                  Password
                </TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <ProfileForm />
              </TabsContent>
              <TabsContent value="password">
                <ProfilePasswordForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
