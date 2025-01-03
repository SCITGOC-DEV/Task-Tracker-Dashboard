const PageRoutes = {
    AddUser: "/users/add",
    AddLocation: "/locations/add",
    AddInventoryCategory: "/inventory-categories/add",
    InventoryCategory: "/inventory-categories",
    EditInventoryCategory: "/inventory-categories/edit/:id",
    InventoryRecords: "/inventory/inventories",
    UpdateInventoryMain: "/inventory/inventories/update/:id",
    InventoryToTask: "/projects/tasks/task-inventories/:id/:taskId",
    AddInventoryToTask: "/projects/tasks/task-inventories/add/:id/:taskId",
    AddInventory: "/inventory-categories/inventories/add/:id",
    AddInventoryMain: "/inventory/inventories/add",
    InventoryDetails: "/projects/details/task-details/inventory-details",
    ProjectInventoryDetails: "/projects/inventory/details/:id/:inventoryId",
    InventoryDetailsMain: "/inventory/inventories/details/:id",
    UpdateInventory: "/projects/inventories/update/:id/:categoryId",
    Projects: "/projects",
    AddProject: "/projects/add",
    EditProject: "/projects/update/:id",
    ProjectInventory: "/projects/project-inventory/:id",
    AddProjectInventory: "/projects/project-inventory/add/:id",
    EditProjectInventory: "/project-inventory/update/:id",
    Tasks: "/projects/tasks/:id",
    TaskDetails: "/projects/details/task-details/:id/:taskId",
    TaskDetailsMain: "/trackings/details/:taskId",
    AddTask: "/projects/tasks/add/:id",
    EditTask: "/projects/details/task-details/edit/:projectId/:taskId",
    TaskInventory: "/task-inventory",
    AddTaskInventory: "/projects/tasks/task-inventory/add",
    TaskInventoryDetails: "/projects/tasks/task-inventory/details/:id",
    EditTaskInventory: "/task-inventory/edit/:id",
    ProjectDetails: "/projects/details/:id",
    ReturnProjectInventory: "projects/return-project/:id",
    PendingInventories: "/pending-inventories",
    RequestedInventories: "/requested-inventories",

    ProjectAdmins: "/project-admins",
    AddProjectAdmins: "/project-admins/add",
    EditProjectAdmins: "/project-admins/edit/:id",
}

export default PageRoutes;