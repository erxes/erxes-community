import Home from "../components/Home";
import { IUser } from "../../auth/types";
import React from "react";
import { queries } from "../graphql";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import dayjs from "dayjs";

type Props = {
  queryParams: any;
  currentUser: IUser;
};

export default function HomeContainer(props: Props) {
  const events = useQuery(gql(queries.feed), {
    variables: {
      contentTypes: ["event"],
    },
  });

  const today = dayjs(new Date()).format("YYYY-MM-DD");

  const todayEvents =
    events.data &&
    events.data.exmFeed &&
    events.data.exmFeed.list.map((e) => {
      if (
        e.eventData.startDate.slice(0, 10) <= today &&
        today <= e.eventData.endDate.slice(0, 10)
      ) {
        return e;
      }

      return null;
    });

  return <Home todayEvents={todayEvents} {...props} />;
}
