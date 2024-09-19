import {gql} from "@apollo/client";

export const GET_DASHBOARD_DATA = gql`
  query MyQuery($startDate: timestamptz!, $endDate: timestamptz!) {
    tasks: tracking_aggregate(where: {created_at: {_gte: $startDate, _lt: $endDate}}) {
      aggregate {
        count
      }
    }
    locations: tracking_aggregate(where: {created_at: {_gte: $startDate, _lt: $endDate}}, distinct_on: fk_location_name) {
      aggregate {
        count(columns: fk_location_name)
      }
    }
    users: tracking_aggregate(where: {created_at: {_gte: $startDate, _lt: $endDate}}, distinct_on: fk_user_name) {
      aggregate {
        count(columns: fk_task_name)
      }
    }
    task_list: tracking(where: {created_at: {_gte: $startDate, _lt: $endDate}}) {
        fk_task_name
    }
    location_list: tracking(where: {created_at: {_gte: $startDate, _lt: $endDate}}) {
        fk_location_name
    }
    user_list: tracking(where: {created_at: {_gte: $startDate, _lt: $endDate}}) {
        fk_user_name
    }
  }
`;