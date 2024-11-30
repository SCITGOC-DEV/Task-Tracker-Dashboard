import { gql } from "@apollo/client";

export const GET_ALL_INVENTORY_RECORDS = gql `
query MyQuery($id: Int!, $limit: Int!, $offset: Int!) {
  inventory_categories(where: {id: {_eq: $id}}) {
    id
    manufacturer
    model_type
    inventory(limit: $limit, offset: $offset, order_by: {created_at: desc}) {
      id
      inventory_category {
        manufacturer
        model_type
      }
      quantity
      unit_price
      date_purchase_received
    }
    total: inventory_aggregate {
      aggregate {
        count
      }
    }
  }
}`

export const GET_INVENTORY_BY_ID = gql `
query MyQuery($id: Int!) {
  inventories(where: {id: {_eq: $id}}) {
    address
    admin_name
    contact_number
    country
    created_at
    date_purchase_received
    date_release
    date_return
    delivered_to_client
    delivery_receipt_no
    email_address
    inventory_category_id
    is_return
    location_stock
    quantity
    scit_control_number
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
    units_on_request
    updated_at
    website
    inventory_category {
      id
      manufacturer
      model_type
    }
  }
}
`

export const UPDATE_INVENTORY_BY_ID = gql `
mutation UpdateInventory(
  $id: Int!,
  $address: String,
  $admin_name: String,
  $contact_number: String,
  $country: String,
  $date_purchase_received: date,
  $date_release: date,
  $date_return: date,
  $delivered_to_client: String,
  $delivery_receipt_no: String,
  $email_address: String,
  $inventory_category_id: Int,
  $is_return: Boolean,
  $location_stock: String,
  $quantity: Int,
  $scit_control_number: String,
  $serial_number_end: String,
  $serial_number_start: String,
  $stock_office: Int,
  $supplier: String,
  $total_amount: numeric,
  $total_stock_amount: Int,
  $total_unit_release: Int,
  $type: String,
  $unit_price: numeric,
  $unit_return: Int,
  $units_on_request: Int,
  $updated_at: timestamptz,
  $website: String
) {
  update_inventories(
    where: { id: { _eq: $id } }, 
    _set: {
      address: $address,
      admin_name: $admin_name,
      contact_number: $contact_number,
      country: $country,
      date_purchase_received: $date_purchase_received,
      date_release: $date_release,
      date_return: $date_return,
      delivered_to_client: $delivered_to_client,
      delivery_receipt_no: $delivery_receipt_no,
      email_address: $email_address,
      inventory_category_id: $inventory_category_id,
      is_return: $is_return,
      location_stock: $location_stock,
      quantity: $quantity,
      scit_control_number: $scit_control_number,
      serial_number_end: $serial_number_end,
      serial_number_start: $serial_number_start,
      stock_office: $stock_office,
      supplier: $supplier,
      total_amount: $total_amount,
      total_stock_amount: $total_stock_amount,
      total_unit_release: $total_unit_release,
      type: $type,
      unit_price: $unit_price,
      unit_return: $unit_return,
      units_on_request: $units_on_request,
      updated_at: $updated_at,
      website: $website
    }
  ) {
    affected_rows
  }
}`

export const ADD_INVENTORY = gql `
mutation MyMutation(
  $supplier: String,
  $country: String,
  $address: String,
  $contact_number: String,
  $email_address: String,
  $website: String,
  $unit_price: numeric!,
  $quantity: Int!,
  $total_amount: numeric,
  $date_purchase_received: date,
  $date_release: date,
  $total_unit_release: Int,
  $delivered_to_client: String,
  $delivery_receipt_no: String,
  $unit_return: Int,
  $location_stock: String,
  $date_return: date,
  $stock_office: Int,
  $serial_number_start: String!,
  $serial_number_end: String,
  $is_return: Boolean!,
  $type: String,
  $inventory_category_id: Int!,
  $part_number: String,
  $total_stock_amount: Int
) {
  inventory_create_inventory(
    supplier: $supplier,
    country: $country,
    address: $address,
    contact_number: $contact_number,
    email_address: $email_address,
    website: $website,
    unit_price: $unit_price,
    quantity: $quantity,
    total_amount: $total_amount,
    date_purchase_received: $date_purchase_received,
    date_release: $date_release,
    total_unit_release: $total_unit_release,
    delivered_to_client: $delivered_to_client,
    delivery_receipt_no: $delivery_receipt_no,
    unit_return: $unit_return,
    location_stock: $location_stock,
    date_return: $date_return,
    stock_office: $stock_office,
    serial_number_start: $serial_number_start,
    serial_number_end: $serial_number_end,
    is_return: $is_return,
    type: $type,
    inventory_category_id: $inventory_category_id,
    part_number: $part_number,
    total_stock_amount: $total_stock_amount
  ) {
    message
    success
  }
}
`