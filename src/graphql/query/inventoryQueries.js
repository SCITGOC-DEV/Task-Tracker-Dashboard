import { gql } from "@apollo/client";

export const GET_ALL_INVENTORY_RECORDS = gql `
query MyQuery($limit: Int!, $offset: Int!) {
  inventories(limit: $limit, offset: $offset, order_by: {created_at: desc}) {
    inventory_category {
      manufacturer
      model_type
      part_number
      device
    }
    id
    address
    admin_name
    contact_number
    country
    date_purchase_received
    date_release
    date_return
    delivered_to_client
    delivery_receipt_no
    email_address
    is_return
    location_stock
    quantity
    scit_control_number
    serial_number
    serial_number_end
    serial_number_start
    stock_office
    supplier
    total_amount
    total_stock_amount
    total_unit_release
    type
    unit_price
    unit_return
    units_in_stock
    units_on_request
    website
    
  }
    total: inventories_aggregate {
    aggregate {
      count
    }
  }
}`