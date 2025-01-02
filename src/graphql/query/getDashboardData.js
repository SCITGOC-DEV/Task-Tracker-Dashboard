import {gql} from "@apollo/client";

export const GET_DASHBOARD_DATA = gql`
  query MyQuery($startDate: timestamptz!, $endDate: timestamptz!) {
    tasks: tasks_aggregate(where: {created_at: {_gte: $startDate, _lt: $endDate}}) {
      aggregate {
        count
      }
    }
    locations: location_aggregate(where: {created_at: {_gte: $startDate, _lt: $endDate}}, distinct_on: location_name) {
      aggregate {
        count(columns: location_name)
      }
    }
    users: users_aggregate(where: {created_at: {_gte: $startDate, _lt: $endDate}}, distinct_on: username) {
      aggregate {
        count(columns: username)
      }
    }
    task_list: tasks(where: {created_at: {_gte: $startDate, _lt: $endDate}}) {
        task_name
    }
    location_list: location(where: {created_at: {_gte: $startDate, _lt: $endDate}}) {
        location_name
    }
    user_list: users(where: {created_at: {_gte: $startDate, _lt: $endDate}}) {
        username
    }
  }
`;