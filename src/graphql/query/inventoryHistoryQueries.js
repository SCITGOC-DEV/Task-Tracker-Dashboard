import { gql } from "@apollo/client";
import {Md1K, MdDeck} from "react-icons/md";

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

export const GET_SCIT_CONTROL_NUMBER_BY_NAME = gql `
query MyQuery($query: String!) {
  inventories(limit: 5, where: {scit_control_number: {_ilike: $query}}) {
    scit_control_number
  }
}`

export const GET_ALL_PROJECT_NAMES = gql `
query MyQuery {
  projects {
    id
    project_name
  }
}
`

export const GET_ALL_INVENTORIES_BY_SCIT = gql`
query MyQuery ($query: String!) {
  inventories(limit: 5, where: {scit_control_number: {_ilike: $query}}) {
    scit_control_number
    id
  }
}`

export const GET_ALL_TASK_NAMES_BY_NAME = gql `
query MyQuery ($query: String!) {
  tasks(limit: 5, where: {task_name: {_ilike: $query}}) {
  id
    task_name
  }
}
`

