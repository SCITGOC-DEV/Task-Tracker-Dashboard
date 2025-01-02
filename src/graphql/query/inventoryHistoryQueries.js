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
query MyQuery($controlNumber: String!) {
  inventories(where: {scit_control_number: {_ilike: $controlNumber}}, limit: 5) {
    id
    part_number
    scit_control_number
    units_on_request
    inventory_category {
      manufacturer
      model_type
      device
    }
  }
}
`

export const GET_ALL_TASK_NAMES_BY_NAME = gql `
query MyQuery ($query: String!) {
  tasks(limit: 5, where: {task_name: {_ilike: $query}}) {
  id
    task_name
  }
}
`

export const GET_ALL_INVENTORIES_BY_MANUFACTURER_AND_MODEL_TYPE = gql `
query MyQuery($scit: String) {
  inventories(where: {scit_control_number: {_ilike: $scit}}, limit: 5) {
    id
    quantity
    scit_control_number
    units_on_request
    inventory_category {
      manufacturer
      model_type
      device
    }
  }
}

`

export const GET_ALL_INVENTORIES_BY_MODEL_TYPE = gql `
query MyQuery($manufacturer: String, $modelType: String) {
  inventories(limit: 5, where: {inventory_category: {manufacturer: {_ilike: $manufacturer}, model_type: {_ilike: $modelType}}}) {
    id
    inventory_category {
      manufacturer
      model_type
    }
  }
}

`

