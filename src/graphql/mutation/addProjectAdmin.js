import {gql} from "@apollo/client";

export const ADD_PROJECT_ADMIN = gql`
mutation MyMutation($name: String!, $password: String!, $address: String!, $email: String!) {
  insert_admin(
    objects: { username: $name, password: $password, address: $address, email: $email, role: "projectadmin" }
  ) {
    affected_rows
  }
}
`