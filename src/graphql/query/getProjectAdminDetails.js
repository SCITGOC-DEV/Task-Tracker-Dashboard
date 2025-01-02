import {gql} from "@apollo/client";

export const GET_PROJECT_ADMIN_DETAILS = gql`
query MyQuery($id: Int!) {
  response: admin_by_pk(id: $id) {
    username
    password
    role
    address
    email
  }
}
`