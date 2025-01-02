import {gql} from "@apollo/client";

export const GET_ALL_PROJECTS_ADMINS = gql `
query MyQuery($limit: Int!, $offset: Int!) {
  admin(where: {role: {_eq: "projectadmin"}}, order_by: {created_at: desc}, limit: $limit, offset: $offset) {
    address
    created_at
    email
    id
    role
    password
    updated_at
    username
  }
  total:admin_aggregate(where: {role: {_eq: "projectadmin"}}) {
    aggregate {
      count
    }
  }
}
`

export const GET_PROJECT_ADMINS_BY_NAME = gql `
query MyQuery($username: String!) {
  response: admin(where: {role: {_eq: "projectadmin"}, username: {_ilike: $username}}, limit: 5) {
    username
    id
  }
}
`