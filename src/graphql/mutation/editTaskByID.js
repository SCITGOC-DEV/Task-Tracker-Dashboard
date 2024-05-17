import { gql } from "@apollo/client";

export const editTaskByID = gql`
  mutation MyMutation($id: Int!, $task_name: String!) {
    update_task_name_by_pk(
      pk_columns: { id: $id }
      _set: { task_name: $task_name }
    ) {
      id
    }
  }
`;
