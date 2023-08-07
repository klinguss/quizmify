import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SignInButton from '@/components/SignInButton';
import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/nextauth';
export default async function Home() {
  const session = await getAuthSession()
  if (session?.user) {
    return redirect('/dashboard')
  }
  return (
   <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
    <Card className='w-[200px]'>
      <CardHeader>
        <CardTitle>Welcome to Quizmify!</CardTitle>
        <CardDescription>
          Quizmify is a quiz app that allows you to create and share quizzez with your friends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInButton text="Sign In with Google"/>
      </CardContent>
    </Card>
   </div>
  )
}
