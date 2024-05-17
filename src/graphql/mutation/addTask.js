import { gql } from "@apollo/client";

export const ADD_TASK = gql`
  mutation MyMutation($task_name: String!) {
    insert_task_name_one(object: { task_name: $task_name }) {
      task_name
    }
  }
`;
