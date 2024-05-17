import { gql } from "@apollo/client";

export const DELETE_TASK = gql`
  mutation MyMutation($id: Int!) {
    delete_task_name_by_pk(id: $id) {
      id
    }
  }
`;
