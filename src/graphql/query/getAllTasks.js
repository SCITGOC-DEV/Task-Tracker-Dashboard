import { gql } from "@apollo/client";

export const getAllTasks = gql`
  query MyQuery($offset: Int, $limit: Int) {
    task_name(order_by: { created_at: desc }, limit: $limit, offset: $offset) {
      id
      task_name
      updated_at
      created_at
    }
    task_name_aggregate {
      aggregate {
        count
      }
    }
  }
`;
