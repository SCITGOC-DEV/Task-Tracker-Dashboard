import {gql} from "@apollo/client";

export const GET_ALL_TASK_INVENTORIES = gql`
query MyQuery($limit: Int!, $offset: Int!) {
  task_inventories(limit: $limit, offset: $offset, order_by: {created_at: desc}) {
    id
    task_name {
      task_name
    }
    status
    approved_user_name
    project {
      project_name
    }
    qty
    request_user_name
    remark
    actual_rent_date
  }
  total: task_inventories_aggregate {
    aggregate {
      count
    }
  }
}`

export const GET_TASK_NAMES = gql`
query MyQuery ($query: String!) {
  tasks(limit: 5, where: {task_name: {_ilike: $query}}) {
    id
    task_name
  }
}
`

export const GET_INVENTORY_NAMES = gql`
    query MyQuery ($query: String!){
  task_inventories(limit: 5, where: {inventory: {scit_control_number: {_ilike: $query}}}) {
    inventory {
      scit_control_number
      id
    }
  }
}
`

export const GET_USER_NAMES = gql`
query MyQuery ($query: String!) {
  users(limit: 5, where: {username: {_ilike: $query}}) {
    id
    username
  }
}`

export const ADD_TASK_INVENTORY =  gql `
mutation MyMutation(
  $project_id: Int!, 
  $task_id: Int!, 
  $inventory_id: Int!, 
  $rent_date: timestamptz!, 
  $return_date: timestamptz!, 
  $qty: Int!, 
  $status: String!, 
  $request_user_name: String!, 
  $request_date: timestamptz!, 
  $remark: String, 
  $actual_rent_date: timestamptz!, 
  $actual_return_date: timestamptz!
) {
  insert_task_inventories(
    objects: {
      project_id: $project_id, 
      task_id: $task_id, 
      inventory_id: $inventory_id, 
      rent_date: $rent_date, 
      return_date: $return_date, 
      qty: $qty, 
      status: $status, 
      request_user_name: $request_user_name, 
      request_date: $request_date, 
      remark: $remark, 
      actual_rent_date: $actual_rent_date, 
      actual_return_date: $actual_return_date
    }
  ) {
    affected_rows
  }
}`

export const GET_TASK_INVENTORY_BY_ID = gql `
query MyQuery($id: Int!) {
  task_inventories(where: {id: {_eq: $id}}) {
    id
    task_name {
      task_name
    }
    status
    approved_user_name
    project {
      project_name
      task {
        id
        task_name
      }
      project_inventory {
        id
        inventory {
          scit_control_number
        }
      }
    }
    qty
    request_user_name
    remark
    actual_rent_date
  }
}
`

export const UPDATE_TASK_INVENTORY = gql`
  mutation MyMutation(
    $id: Int!,
    $actualRentDate: timestamptz,
    $actualReturnDate: timestamptz,
    $inventoryId: Int!,
    $projectId: Int!,
    $qty: Int!,
    $remark: String,
    $rentDate: timestamptz,
    $requestDate: timestamptz,
    $requestUserName: String,
    $returnDate: timestamptz!,
    $status: String,
    $taskId: Int!
  ) {
    update_task_inventories(
      where: {id: {_eq: $id}},
      _set: {
        actual_rent_date: $actualRentDate,
        actual_return_date: $actualReturnDate,
        inventory_id: $inventoryId,
        project_id: $projectId,
        qty: $qty,
        remark: $remark,
        rent_date: $rentDate,
        request_date: $requestDate,
        request_user_name: $requestUserName,
        return_date: $returnDate,
        status: $status,
        task_id: $taskId
      }
    ) {
      affected_rows
    }
  }
`;

export const DELETE_TASK_INVENTORY_BY_ID = gql `
mutation MyMutation ($id: Int!) {
  delete_task_inventories(where: {id: {_eq: $id}}) {
    affected_rows
  }
}`