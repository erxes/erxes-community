"use client"

import dynamic from "next/dynamic"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const List = dynamic(() => import("./List"))

const Feed = () => {
  return (
    <div>
      <Tabs defaultValue="post">
        <TabsList className="w-full items-center flex">
          <TabsTrigger className="" value="post">
            Post
          </TabsTrigger>
          <TabsTrigger value="event">Event</TabsTrigger>
          <TabsTrigger value="bravo">Bravo</TabsTrigger>
          <TabsTrigger value="publicHoliday">Public holiday</TabsTrigger>
          <TabsTrigger value="welcome">Welcome</TabsTrigger>
        </TabsList>

        <TabsContent value="post">
          <List contentType="post" />
        </TabsContent>
        <TabsContent value="event">
          <List contentType="event" />
        </TabsContent>
        <TabsContent value="bravo">
          <List contentType="bravo" />
        </TabsContent>
        <TabsContent value="publicHoliday">
          <List contentType="publicHoliday" />
        </TabsContent>
        <TabsContent value="welcome">
          <List contentType="welcome" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Feed
