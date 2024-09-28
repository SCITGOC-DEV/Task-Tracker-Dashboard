import { gql } from "@apollo/client";

export const DELETE_TASK = gql`
  mutation MyMutation($id: Int!) {
    delete_tasks(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
`;
