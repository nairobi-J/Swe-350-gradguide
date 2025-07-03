"use client"

// Correct import for redirect in App Router client components
import { redirect } from "next/navigation"; 

export default function Page() {
  // This will redirect any visitor from '/' to '/dashboard'
  redirect('/dashboard');

  // This return statement will effectively never be reached because redirect() throws an error.
  // It's common practice to just return null or nothing after a redirect for clarity.
  return null; 
}