import { gql } from "@apollo/client";

export const getTaskByID = gql`
  query MyQuery($id: Int!) {
    task_name_by_pk(id: $id) {
      task_name
    }
  }
`;

export const GET_TASKS_BY_ID = gql`
query MyQuery($taskId: Int!) {
  tasks(where: {id: {_eq: $taskId}}) {
    task_name
    actual_end_date_time
    actual_start_date_time
    created_at
    created_by
    dispatch
    end_coords
    end_date_time
    fk_location_name
    fk_project_id
    hardware
    id
    note
    percentage
    permit_photo_url
    quantity
    signature_photo_url
    start_coords
    start_date_time
    status
    updated_at
    project {
      project_name
    }
    users: assigned_task(limit: 5, order_by: {created_at: desc}) {
      id  
      user {
        username
        phone
        id
        email
        address
      }
    }
    task_inventories: task_inventory(limit: 5, order_by: {created_at: desc}) {
      total_qty
      inventory {
        admin_name
        id
        inventory_category {
          device
          manufacturer
          model_type
        }
      }
    }
    users_count: assigned_task_aggregate {
      aggregate {
        count
      }
    }
    inventories_count: task_inventory_aggregate {
      aggregate {
        count
      }
    }
  }
}

`

export const DELETE_ASSIGNED_TASK_BY_ID = gql `
mutation MyMutation($assigned_task_id: Int!, $task_id: Int!) {
  task_remove_assigned_task(assigned_task_id: $assigned_task_id, task_id: $task_id) {
    success
    message
  }
}`

export const GET_ASSIGNED_USERS_BY_TASK_ID = gql`
  query MyQuery($taskId: Int!, $limit: Int, $offset: Int) {
    tasks(where: { id: { _eq: $taskId } }) {
      users: assigned_task(limit: $limit, offset: $offset, order_by: {created_at: desc}) {
        id
        user {
          username
          phone
          id
          email
          address
        }
      }
      users_count: assigned_task_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const GET_TASK_INVENTORIES_BY_TASK_ID = gql `
query MyQuery($taskId: Int!, $limit: Int!, $offset: Int!) {
  tasks(where: {id: {_eq: $taskId}}, limit: $limit, offset: $offset) {
    task_inventories: task_inventory(limit: 5, order_by: {created_at: desc}) {
      qty
      total_qty
      inventory {
        id
        admin_name
        inventory_category {
          device
          manufacturer
          model_type
        }
      }
    }
    inventories_count: task_inventory_aggregate {
      aggregate {
        count
      }
    }
  }
}`