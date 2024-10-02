import { gql } from "@apollo/client";

export const GET_ALL_INVENTORY_HISTORIES = gql `
query MyQuery($offset: Int!, $limit: Int!) {
  task_inventories(offset: $offset, limit: $limit) {
    task {
      task_name
      project {
        project_name
      }
    }
    inventory {
      serial_number
      serial_number_end
      serial_number_start
      inventory_category {
        model_type
      }
    }
  }
  total: task_inventories_aggregate {
    aggregate {
      count
    }
  }
}`