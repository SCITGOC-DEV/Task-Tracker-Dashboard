const UserRole = Object.freeze({
    ADMIN: 'Admin',
    PROJECT_ADMIN: 'Project Admin'
})

export function getUserRole(role) {
    if (role === UserRole.ADMIN) return UserRole.ADMIN.toLocaleLowerCase();
    else return "project-admin"
}

export default UserRole;