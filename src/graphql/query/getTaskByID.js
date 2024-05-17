import { gql } from "@apollo/client";

export const getTaskByID = gql`
  query MyQuery($id: Int!) {
    task_name_by_pk(id: $id) {
      task_name
    }
  }
`;
